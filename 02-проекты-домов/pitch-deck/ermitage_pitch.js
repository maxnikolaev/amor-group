const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { FaTree, FaHome, FaChartLine, FaShieldAlt, FaRoad, FaFire, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFileSignature, FaCalculator, FaLightbulb } = require("react-icons/fa");

// ===== THEME =====
const COLORS = {
  forest:   "1B4332",  // deep forest green - primary
  moss:     "52796F",  // sage/moss - secondary
  cream:    "F4F1DE",  // warm cream - backgrounds
  sand:     "E8E2D0",  // light sand
  white:    "FFFFFF",
  accent:   "D4A574",  // warm gold/amber - accent
  dark:     "1A1A1A",
  gray:     "6B7280",
  lightGray:"E5E7EB",
  red:      "B85042",
  green:    "2D6A4F",
};

const FONT_H = "Georgia";
const FONT_B = "Calibri";

// ===== ICON HELPER =====
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const makeShadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

async function main() {
  // Pre-render icons
  const icons = {
    tree:    await iconToBase64Png(FaTree, "#52796F"),
    home:    await iconToBase64Png(FaHome, "#D4A574"),
    chart:   await iconToBase64Png(FaChartLine, "#1B4332"),
    shield:  await iconToBase64Png(FaShieldAlt, "#B85042"),
    road:    await iconToBase64Png(FaRoad, "#6B7280"),
    fire:    await iconToBase64Png(FaFire, "#B85042"),
    marker:  await iconToBase64Png(FaMapMarkerAlt, "#B85042"),
    users:   await iconToBase64Png(FaUsers, "#1B4332"),
    check:   await iconToBase64Png(FaCheckCircle, "#2D6A4F"),
    times:   await iconToBase64Png(FaTimesCircle, "#B85042"),
    warn:    await iconToBase64Png(FaExclamationTriangle, "#D4A574"),
    doc:     await iconToBase64Png(FaFileSignature, "#1B4332"),
    calc:    await iconToBase64Png(FaCalculator, "#52796F"),
    bulb:    await iconToBase64Png(FaLightbulb, "#D4A574"),
  };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Макс Николаев";
  pres.title = "ДНП Усадьба Эрмитаж — Инвестиционная справка";

  // ================================================================
  // SLIDE 1: TITLE
  // ================================================================
  let s1 = pres.addSlide();
  s1.background = { color: COLORS.forest };

  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: COLORS.accent }
  });

  s1.addImage({ data: icons.tree, x: 0.6, y: 0.5, w: 0.7, h: 0.7 });

  s1.addText("ДНП «УСАДЬБА ЭРМИТАЖ»", {
    x: 0.5, y: 1.4, w: 9, h: 0.8,
    fontSize: 36, fontFace: FONT_H, color: COLORS.white, bold: true, align: "left", margin: 0
  });

  s1.addText("Инвестиционная справка · Продуктовая концепция · Юридический анализ", {
    x: 0.5, y: 2.2, w: 9, h: 0.5,
    fontSize: 16, fontFace: FONT_B, color: COLORS.sand, align: "left", margin: 0
  });

  s1.addShape(pres.shapes.LINE, {
    x: 0.5, y: 2.9, w: 3, h: 0,
    line: { color: COLORS.accent, width: 2 }
  });

  s1.addText("Можайский район, Московская область\n100 км от МКАД по Минскому шоссе", {
    x: 0.5, y: 3.2, w: 9, h: 0.6,
    fontSize: 14, fontFace: FONT_B, color: COLORS.sand, align: "left", margin: 0
  });

  s1.addText("Май 2025 — Июль 2026", {
    x: 0.5, y: 4.8, w: 9, h: 0.4,
    fontSize: 12, fontFace: FONT_B, color: COLORS.sand, align: "left", margin: 0
  });

  // ================================================================
  // SLIDE 2: PRODUCT CONCEPT
  // ================================================================
  let s2 = pres.addSlide();
  s2.background = { color: COLORS.cream };

  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: COLORS.forest }
  });

  s2.addText("Продуктовая концепция", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0
  });

  s2.addText("Что мы продаём?", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 16, fontFace: FONT_B, color: COLORS.gray, italic: true, margin: 0
  });

  // Main concept card
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.5, w: 9, h: 1.2,
    fill: { color: COLORS.white }, shadow: makeShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.5, w: 0.08, h: 1.2,
    fill: { color: COLORS.forest }
  });
  s2.addImage({ data: icons.tree, x: 0.8, y: 1.75, w: 0.5, h: 0.5 });
  s2.addText("Эко-дачный посёлок премиального уровня для сезонного проживания", {
    x: 1.5, y: 1.65, w: 7.8, h: 0.5,
    fontSize: 18, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0
  });
  s2.addText("Уникальное природное окружение — заповедный лес Бородинского лесничества по всему периметру", {
    x: 1.5, y: 2.15, w: 7.8, h: 0.4,
    fontSize: 13, fontFace: FONT_B, color: COLORS.gray, margin: 0
  });

  // Three pillars
  const pillars = [
    { icon: icons.marker, title: "Локация", text: "100 км МКАД\nМинское шоссе\nМожайский район" },
    { icon: icons.users, title: "Целевая аудитория", text: "Семьи 35-50 лет\nиз Москвы\nПокупка за наличные" },
    { icon: icons.home, title: "Продукт", text: "Участки 15 соток\nдля дачи / 2-го дома\nСезонное проживание" },
  ];

  pillars.forEach((p, i) => {
    const x = 0.5 + i * 3.1;
    s2.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 3.0, w: 2.8, h: 2.1,
      fill: { color: COLORS.white }, shadow: makeShadow()
    });
    s2.addImage({ data: p.icon, x: x + 0.2, y: 3.2, w: 0.4, h: 0.4 });
    s2.addText(p.title, {
      x: x + 0.7, y: 3.2, w: 2.0, h: 0.4,
      fontSize: 14, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0, valign: "middle"
    });
    s2.addText(p.text, {
      x: x + 0.2, y: 3.7, w: 2.4, h: 1.2,
      fontSize: 12, fontFace: FONT_B, color: COLORS.dark, margin: 0, lineSpacingMultiple: 1.3
    });
  });

  // Bottom insight
  s2.addText("Не ИЖС для постоянного проживания. Не бизнес-класс. Эко-дача с уникальным лесом.", {
    x: 0.5, y: 5.2, w: 9, h: 0.35,
    fontSize: 13, fontFace: FONT_B, color: COLORS.accent, italic: true, align: "center", margin: 0
  });

  // ================================================================
  // SLIDE 3: MARKET DATA
  // ================================================================
  let s3 = pres.addSlide();
  s3.background = { color: COLORS.cream };

  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: COLORS.forest }
  });

  s3.addText("Реальные цены рынка", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0
  });

  s3.addText("10 посёлков Можайского района · данные Посёлкино · 2025", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 14, fontFace: FONT_B, color: COLORS.gray, italic: true, margin: 0
  });

  // Table
  const tableData = [
    [
      { text: "Посёлок", options: { fill: { color: COLORS.forest }, color: COLORS.white, bold: true, fontSize: 11, fontFace: FONT_B, align: "left" } },
      { text: "₽/сотку", options: { fill: { color: COLORS.forest }, color: COLORS.white, bold: true, fontSize: 11, fontFace: FONT_B, align: "center" } },
      { text: "км МКАД", options: { fill: { color: COLORS.forest }, color: COLORS.white, bold: true, fontSize: 11, fontFace: FONT_B, align: "center" } },
      { text: "Статус", options: { fill: { color: COLORS.forest }, color: COLORS.white, bold: true, fontSize: 11, fontFace: FONT_B, align: "left" } },
    ],
    [{ text: "Bayside Residence", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "419 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center", bold: true } }, { text: "110", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Активные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.green } }],
    [{ text: "Протва Парк", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "110 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center", bold: true } }, { text: "100", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Активные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.green } }],
    [{ text: "Можайские сады", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "80 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "95", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Активные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.green } }],
    [{ text: "Спутник", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "75 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "95", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Финальные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.gray } }],
    [{ text: "Шелест Парк", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "66 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "100", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Старт", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.accent } }],
    [{ text: "Макарово", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "60 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "98", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Активные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.green } }],
    [{ text: "Речной", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "55 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "98", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Финальные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.gray } }],
    [{ text: "Можайское море", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "49 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "98", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Финальные", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.gray } }],
    [{ text: "Лесной (сады)", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "50 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "115", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Старт", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.accent } }],
    [{ text: "Озёрный", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark } }, { text: "15 000", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "120", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.dark, align: "center" } }, { text: "Продан", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.gray } }],
  ];

  s3.addTable(tableData, {
    x: 0.5, y: 1.5, w: 6.5,
    colW: [2.5, 1.5, 1.0, 1.5],
    border: { pt: 0.5, color: COLORS.lightGray },
    rowH: 0.32,
  });

  // Key stats on the right
  const statX = 7.3;
  const stats = [
    { value: "60 000", label: "Медиана без Bayside", color: COLORS.forest },
    { value: "110 000", label: "Потолок без газа", color: COLORS.accent },
    { value: "70-95K", label: "Реалистичная цена Эрмитажа", color: COLORS.moss },
  ];

  stats.forEach((st, i) => {
    const y = 1.45 + i * 1.05;
    s3.addShape(pres.shapes.RECTANGLE, {
      x: statX, y: y, w: 2.3, h: 0.9,
      fill: { color: COLORS.white }, shadow: makeShadow()
    });
    s3.addShape(pres.shapes.RECTANGLE, {
      x: statX, y: y, w: 0.06, h: 0.9,
      fill: { color: st.color }
    });
    s3.addText(st.value, {
      x: statX + 0.2, y: y + 0.1, w: 2.0, h: 0.45,
      fontSize: 22, fontFace: FONT_H, color: st.color, bold: true, margin: 0
    });
    s3.addText(st.label, {
      x: statX + 0.2, y: y + 0.55, w: 2.0, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: COLORS.gray, margin: 0
    });
  });

  // Bottom conclusion
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.1, w: 9, h: 0.45,
    fill: { color: COLORS.forest }
  });
  s3.addText("Эрмитаж — единственный объект с заповедным лесом по периметру в ценовом сегменте 70-95 тыс./сотку", {
    x: 0.7, y: 5.1, w: 8.6, h: 0.45,
    fontSize: 11, fontFace: FONT_B, color: COLORS.white, italic: true, valign: "middle", margin: 0
  });

  // ================================================================
  // SLIDE 4: LEGAL ANALYSIS
  // ================================================================
  let s4 = pres.addSlide();
  s4.background = { color: COLORS.cream };

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: COLORS.forest }
  });

  s4.addText("Юридический факт-чек", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0
  });

  s4.addText("Перевод земли в ИЖС · процедура, стоимость, риски", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 14, fontFace: FONT_B, color: COLORS.gray, italic: true, margin: 0
  });

  // Two paths
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.5, w: 4.3, h: 2.0,
    fill: { color: COLORS.white }, shadow: makeShadow()
  });
  s4.addImage({ data: icons.check, x: 0.7, y: 1.7, w: 0.4, h: 0.4 });
  s4.addText("Путь 1: Смена ВРИ", {
    x: 1.2, y: 1.7, w: 3.4, h: 0.4,
    fontSize: 15, fontFace: FONT_H, color: COLORS.green, bold: true, margin: 0, valign: "middle"
  });
  s4.addText([
    { text: "Если земля уже в категории «населённые пункты»", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Меняем вид разрешённого использования", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Через МФЦ, рассмотрение 30 дней", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Проще и быстрее", options: { fontSize: 11, fontFace: FONT_B, color: COLORS.green, bold: true } },
  ], { x: 0.7, y: 2.3, w: 3.9, h: 1.0, margin: 0, lineSpacingMultiple: 1.4 });

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.5, w: 4.3, h: 2.0,
    fill: { color: COLORS.white }, shadow: makeShadow()
  });
  s4.addImage({ data: icons.warn, x: 5.4, y: 1.7, w: 0.4, h: 0.4 });
  s4.addText("Путь 2: Смена категории", {
    x: 5.9, y: 1.7, w: 3.4, h: 0.4,
    fontSize: 15, fontFace: FONT_H, color: COLORS.accent, bold: true, margin: 0, valign: "middle"
  });
  s4.addText([
    { text: "Если земля сельхозназначения", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Расширение границ населённого пункта", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Общественные слушания, до 45 дней", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "→ Сложнее и дольше", options: { fontSize: 11, fontFace: FONT_B, color: COLORS.red, bold: true } },
  ], { x: 5.4, y: 2.3, w: 3.9, h: 1.0, margin: 0, lineSpacingMultiple: 1.4 });

  // Cost box
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.6, w: 4.3, h: 1.3,
    fill: { color: COLORS.white }, shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.6, w: 0.06, h: 1.3,
    fill: { color: COLORS.accent }
  });
  s4.addImage({ data: icons.calc, x: 0.8, y: 3.8, w: 0.35, h: 0.35 });
  s4.addText("Стоимость перевода", {
    x: 1.3, y: 3.8, w: 3.3, h: 0.35,
    fontSize: 14, fontFace: FONT_H, color: COLORS.forest, bold: true, margin: 0, valign: "middle"
  });
  s4.addText([
    { text: "~100 000 ₽ / участок", options: { breakLine: true, fontSize: 12, fontFace: FONT_B, color: COLORS.dark, bold: true } },
    { text: "(пошлины + кадастровый инженер)", options: { breakLine: true, fontSize: 10, fontFace: FONT_B, color: COLORS.gray } },
    { text: "55 участков → ~5,5 млн ₽", options: { breakLine: true, fontSize: 12, fontFace: FONT_B, color: COLORS.accent, bold: true } },
    { text: "Налог после: кадастровая ↑ 3-7×", options: { fontSize: 10, fontFace: FONT_B, color: COLORS.red } },
  ], { x: 0.8, y: 4.2, w: 3.8, h: 0.7, margin: 0, lineSpacingMultiple: 1.2 });

  // Risks box
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.6, w: 4.3, h: 1.3,
    fill: { color: COLORS.white }, shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.6, w: 0.06, h: 1.3,
    fill: { color: COLORS.red }
  });
  s4.addImage({ data: icons.shield, x: 5.5, y: 3.8, w: 0.35, h: 0.35 });
  s4.addText("Риски отказа", {
    x: 6.0, y: 3.8, w: 3.3, h: 0.35,
    fontSize: 14, fontFace: FONT_H, color: COLORS.red, bold: true, margin: 0, valign: "middle"
  });
  s4.addText([
    { text: "• Реестр ценных сельхозугодий Минсельхоза", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "• Несоответствие градостроительному плану", options: { breakLine: true, fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
    { text: "• «Красные линии» в ПЗЗ", options: { fontSize: 11, fontFace: FONT_B, color: COLORS.dark } },
  ], { x: 5.5, y: 4.2, w: 3.8, h: 0.7, margin: 0, lineSpacingMultiple: 1.3 });

  // First action
  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.05, w: 9, h: 0.45,
    fill: { color: COLORS.forest }
  });
  s4.addImage({ data: icons.doc, x: 0.8, y: 5.12, w: 0.3, h: 0.3 });
  s4.addText("Первое действие: запросить градостроительный план в администрации Можайского района (бесплатно, 14 дней)", {
    x: 1.3, y: 5.05, w: 8.0, h: 0.45,
    fontSize: 11, fontFace: FONT_B, color: COLORS.white, valign: "middle", margin: 0
  });

  // ================================================================
  // SLIDE 5: STRATEGY & NEXT STEPS
  // ================================================================
  let s5 = pres.addSlide();
  s5.background = { color: COLORS.forest };

  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: COLORS.accent }
  });

  s5.addText("Стратегия и следующие шаги", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32, fontFace: FONT_H, color: COLORS.white, bold: true, margin: 0
  });

  s5.addText("Что делать сейчас", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 14, fontFace: FONT_B, color: COLORS.sand, italic: true, margin: 0
  });

  // Key insight box
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.5, w: 9, h: 0.8,
    fill: { color: COLORS.moss }
  });
  s5.addImage({ data: icons.bulb, x: 0.8, y: 1.65, w: 0.4, h: 0.4 });
  s5.addText("Не гнаться за ИЖС + газом. Позиционировать как эко-дачный посёлок с минимальной инфраструктурой.", {
    x: 1.4, y: 1.5, w: 7.9, h: 0.8,
    fontSize: 14, fontFace: FONT_H, color: COLORS.white, italic: true, valign: "middle", margin: 0
  });

  // Steps
  const steps = [
    { num: "1", title: "Запросить ГПЗУ", text: "Градостроительный план в администрации Можайского р-на. Бесплатно, 14 дней. Параллельно проверить ПЗЗ." },
    { num: "2", title: "Забор + КПП", text: "Главный продажный триггер. Без ограждения участок не воспринимается как посёлок." },
    { num: "3", title: "Запустить продажи", text: "70-85 тыс./сотку. ЦИАН, Авито, Посёлкино. Фокус на эко-сторителлинге: заповедный лес." },
    { num: "4", title: "Перевод земли", text: "Второй этап, после первых продаж. ~100 тыс./участок. Поднимает цену до 95-100 тыс./сотку." },
  ];

  steps.forEach((step, i) => {
    const y = 2.5 + i * 0.68;
    // Number circle
    s5.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fill: { color: COLORS.accent }
    });
    s5.addText(step.num, {
      x: 0.5, y: y, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: FONT_H, color: COLORS.forest, bold: true, align: "center", valign: "middle", margin: 0
    });
    s5.addText(step.title, {
      x: 1.2, y: y, w: 2.5, h: 0.5,
      fontSize: 14, fontFace: FONT_H, color: COLORS.white, bold: true, margin: 0, valign: "middle"
    });
    s5.addText(step.text, {
      x: 3.8, y: y, w: 5.7, h: 0.5,
      fontSize: 11, fontFace: FONT_B, color: COLORS.sand, margin: 0, valign: "middle"
    });
  });

  // Bottom line
  s5.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.2, w: 9, h: 0,
    line: { color: COLORS.moss, width: 1 }
  });
  s5.addText("Модель работает в реальных цифрах рынка. Газ и ИЖС — опцион на будущее, не условие входа.", {
    x: 0.5, y: 5.3, w: 9, h: 0.3,
    fontSize: 12, fontFace: FONT_B, color: COLORS.accent, italic: true, align: "center", margin: 0
  });

  // ================================================================
  // SAVE
  // ================================================================
  const outputPath = "/home/max/PROJECTS/Development/2026-02--now - Эрмитаж/Ermitage_Pitch.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Saved to: " + outputPath);
}

main().catch(console.error);
