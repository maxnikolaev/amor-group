# -*- coding: utf-8 -*-
"""
Финмодель: сравнение стратегий ДНП «Усадьба Эрмитаж» (2026-08-11)
===============================================================
Основание: веха log/2026-08-11_capex-занижен-в-2-раза.md — реальный CAPEX 90–140 млн ₽
(в финмодели ТопДевелопер — 51.75 млн ₽, занижение в 1.7–2.7 раза).

Стратегии:
  S1 — Полный редевелопмент (55 уч., ИЖС + газ + асфальт, цены собственности)
  S2 — Лёгкий вход (17 свободных уч., продажа прав аренды, минимальный CAPEX)
  S3 — Гибрид (лёгкий вход сейчас -> опция редевелопмента оставшихся 38 уч.)

Допущения (прозрачные, правки в начале файла):
  - УСН 15% с положительной годовой прибыли
  - Взносы: вступительный 50К + целевой 200К на участок при продаже;
    членские 60К/уч/год со следующего после продажи года (только проданные)
  - Ставки дисконтирования: 18% и 20%
"""
import sys

SOTKA = 15                      # соток на участок
RATE = [0.18, 0.20]             # ставки дисконтирования
TAX = 0.15                      # УСН 15%
ENTRY_FEE, TARGET_FEE, MEMBER_FEE = 50_000, 200_000, 60_000

def npv(cf, rate):
    return sum(c / (1 + rate) ** t for t, c in enumerate(cf))

def irr(cf, lo=-0.9, hi=10.0):
    """Численный IRR (бисекция по NPV)."""
    def f(r):
        return npv(cf, r)
    if f(lo) < 0 and f(hi) < 0:
        return float('nan')
    for _ in range(100):
        mid = (lo + hi) / 2
        if f(mid) > 0:
            lo = mid
        else:
            hi = mid
        if abs(f(mid)) < 1e-6:
            return mid
    return (lo + hi) / 2

def payback(cf):
    acc, prev = 0.0, 0.0
    for t, c in enumerate(cf):
        acc += c
        if acc >= 0:
            return t + (0 - prev) / (acc - prev) if (acc - prev) != 0 else t
        prev = acc
    return float('inf')

def run(plots, price_sotka, capex, capex_sched, opex_sched, sales_sched, label):
    """Считает стратегию. sales_sched[t] = сколько участков продано в год t (t>=1)."""
    n = len(sales_sched) + 1  # t=0..n
    cf = [0.0] * n
    rev = 0.0; fees = 0.0; opx = 0.0; cpx = 0.0; tax_total = 0.0
    sold_before = 0
    for t in range(n):
        # CAPEX
        c = capex * capex_sched[t] if t < len(capex_sched) else 0
        cpx += c
        cf[t] -= c
        # OPEX
        o = opex_sched[t] if t < len(opex_sched) else 0
        opx += o
        cf[t] -= o
        # Продажи (год t>=1)
        if t >= 1:
            s = sales_sched[t - 1]
            r = s * SOTKA * price_sotka
            f = s * (ENTRY_FEE + TARGET_FEE)
            m = sold_before * MEMBER_FEE
            sold_before += s
            rev += r; fees += f
            income = r + f + m
            # УСН 15% на прибыль года (доход - расходы года)
            prof = income - o - c
            if prof > 0:
                tx = prof * TAX
                tax_total += tx
                cf[t] += income - tx
            else:
                cf[t] += income
        else:
            # t=0: доходов нет
            pass
    # Хвост: членские взносы проданных участков после горизонта (не считаем)
    profit = rev + fees - cpx - opx - tax_total
    inv = cpx + opx
    roi = profit / inv if inv else 0
    out = {
        'label': label, 'plots': plots, 'price_sotka': price_sotka,
        'revenue': rev, 'fees': fees, 'capex': cpx, 'opex': opx,
        'tax': tax_total, 'profit': profit, 'roi': roi,
        'cf': cf,
        'npv18': npv(cf, RATE[0]), 'npv20': npv(cf, RATE[1]),
        'irr': irr(cf), 'payback': payback(cf),
    }
    return out

def fmt(v, mln=True):
    if mln:
        return f"{v/1e6:8.1f} млн"
    return f"{v:8.0f}"

def show(r):
    print(f"\n### {r['label']}")
    print(f"  Участков: {r['plots']}  Цена: {r['price_sotka']/1000:.0f} тыс/сотку")
    print(f"  Выручка от продаж : {fmt(r['revenue'])}  Взносы: {fmt(r['fees'])}")
    print(f"  CAPEX: {fmt(r['capex'])}  OPEX: {fmt(r['opex'])}  УСН: {fmt(r['tax'])}")
    print(f"  Чистая прибыль    : {fmt(r['profit'])}   ROI: {r['roi']*100:6.1f}%")
    print(f"  NPV@18%: {fmt(r['npv18'])}   NPV@20%: {fmt(r['npv20'])}   IRR: {r['irr']*100:5.1f}%   Окупаемость: {r['payback']:.1f} г.")
    print(f"  Потоки (млн): {[f'{c/1e6:.1f}' for c in r['cf']]}")

def be_price(capex, opex_total, sotka, fees_net):
    """Цена сотки при нулевой прибыли (без налога): (CAPEX + OPEX - взносы) / сотки."""
    return (capex + opex_total - fees_net) / sotka

print("=" * 78)
print("ДНП «Усадьба Эрмитаж» — сравнение стратегий (реальный CAPEX)")
print("=" * 78)

results = []

# ---------- S1: Полный редевелопмент, 55 участков ----------
for p, capex in [(150_000, 90e6), (170_000, 115e6), (190_000, 140e6)]:
    r = run(
        plots=55, price_sotka=p, capex=capex,
        capex_sched=[0.6, 0.4, 0, 0, 0, 0],
        opex_sched=[4.9e6, 9.8e6, 9.8e6, 9.8e6, 9.8e6, 9.8e6],
        sales_sched=[10, 12, 12, 11, 10],
        label=f"S1 Полный редевелопмент 55уч | CAPEX {capex/1e6:.0f} млн | {p/1000:.0f}К/сот",
    )
    results.append(r); show(r)

# ---------- S2: Лёгкий вход, 17 свободных участков ----------
for p, capex in [(60_000, 10e6), (75_000, 10e6), (75_000, 15e6), (95_000, 10e6)]:
    r = run(
        plots=17, price_sotka=p, capex=capex,
        capex_sched=[0.7, 0.3, 0, 0],
        opex_sched=[1.0e6, 2.0e6, 2.0e6, 2.0e6],
        sales_sched=[6, 6, 5],
        label=f"S2 Лёгкий вход 17уч | CAPEX {capex/1e6:.0f} млн | {p/1000:.0f}К/сот",
    )
    results.append(r); show(r)

# ---------- S3: Гибрид (лёгкий вход -> редевелопмент 38) ----------
# Фаза 1 (t0-t2): как S2 base; Фаза 2 (t2-t5): доп. CAPEX до полного набора, 38 уч по 170К
r = run(
    plots=55, price_sotka=170_000, capex=115e6,
    capex_sched=[0.14, 0.06, 0.35, 0.25, 0.15, 0.05],
    opex_sched=[1.75e6, 3.5e6, 6.0e6, 9.8e6, 9.8e6, 9.8e6],
    sales_sched=[6, 9, 11, 12, 10],
    label="S3 Гибрид (17 уч по 75К/сот t1-2 + 38 уч по 170К/сот t2-5)",
)
results.append(r); show(r)

# ---------- Точки безубыточности ----------
print("\n" + "=" * 78)
print("ТОЧКИ БЕЗУБЫТОЧНОСТИ (цена сотки при нулевой прибыли, с учётом взносов)")
print("=" * 78)
print("\nПолный редевелопмент, 55 уч, 825 соток (взносы нетто ≈ 27 млн за 5 лет):")
for capex in (90e6, 115e6, 140e6):
    print(f"  CAPEX {capex/1e6:3.0f} млн -> безубыточность {be_price(capex, 49e6, 825, 27e6)/1000:6.0f} тыс/сотку")
print("\nЛёгкий вход, 17 уч, 255 соток (взносы нетто ≈ 5.25 млн за 3 года):")
for capex in (10e6, 15e6, 20e6):
    print(f"  CAPEX {capex/1e6:3.0f} млн -> безубыточность {be_price(capex, 7e6, 255, 5.25e6)/1000:6.0f} тыс/сотку")
print("\nПолный редевелопмент при инвентаре 17 уч (255 соток, CAPEX 115 млн):")
print(f"  Безубыточность: {be_price(115e6, 49e6, 255, 5.25e6)/1000:6.0f} тыс/сотку  <- нереалистично, стратегия отпадает")

print("\n" + "=" * 78)
print("ВЫВОДЫ МОДЕЛИ (2026-08-11)")
print("=" * 78)
print("""1. Полный редевелопмент при реальном CAPEX отрицателен при всех ценах
   до 190К/сот (прибыль −18…−39 млн). Безубыточность 136–196 тыс/сотку —
   достижима только в верхней части диапазона «с газом» (160–180К/сот)
   и только при CAPEX <= 90 млн. Иначе проект гарантированно убыточен.
2. Лёгкий вход на 17 уч: безубыточность 46–85 тыс/сотку. При 75–95К/сот и
   CAPEX 10 млн — прибыльная операция (прибыль 4–8 млн, ROI 24–49%,
   NPV +1.3…+4.4 млн, IRR 27–48%). Бюджет CAPEX — решающий фактор:
   при 15 млн и цене 75К — уже убыток.
3. Гибрид: отрицателен в базе (NPV −23 млн), работает только как ОПЦИЯ:
   фаза 2 запускается лишь при доказанном спросе фазы 1 + успешном ИЖС.
4. Если свободных участков действительно 17 (а не 55) — полный редевелопмент
   невозможен (безубыточность ~623 тыс/сотку). Блокер #5 (53 vs 55 vs 17) —
   самый важный вопрос для решения: от него зависит выбор стратегии.
5. Ключевой актив проекта — дешёвая земля (аренда 49 лет от администрации,
   в модели нет затрат на выкуп). Монетизировать её можно только продажей
   прав аренды/переуступкой — без многомиллионного CAPEX на инфраструктуру.""")
