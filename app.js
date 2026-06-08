"use strict";

const MODULES = [
  { id: "home", title: "Выбор механизма", short: "Главная", icon: "grid", status: "draft" },
  { id: "info", title: "Тарифы электроэнергии", short: "Тарифы э/э", icon: "database", status: "data" },
  { id: "punc", title: "ПУНЦ и пиковые часы", short: "ПУНЦ", icon: "clock", status: "draft" },
  { id: "categories", title: "Ценовые категории 1-6", short: "ЦК 1-6", icon: "calculator", status: "draft" },
  { id: "uptime4", title: "Аптайм на 4 ЦК", short: "Аптайм 4 ЦК", icon: "activity", status: "calc" },
  { id: "orem", title: "Эффект выхода на ОРЭМ", short: "ОРЭМ", icon: "nodes", status: "calc" },
  { id: "gas", title: "Тарифы газ", short: "Газ", icon: "flame", status: "data" },
  { id: "generation", title: "Распределенная генерация", short: "Генерация", icon: "bolt", status: "calc" },
];

const SOURCE_MODULES = {
  tariffs: "../tariffs-2026/app-v2/data.js",
  punc: "../krasny-yar-energo/platform/integrations/market-data/README.md",
  calc6: "../calc-6cz-orem/README.md",
  ck4: "../krasny-yar-energo/app/backend/market.py",
  orem: "../orem-node-price-app/README.md",
  oremData: "../orem-node-price-app/data/ruc-history-krasny-yar.json",
  dg: "../distributed-generation-finmodel/app/README.md",
};

const PLAN_HOURS_ZONE1_2026 = {
  1: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  2: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  3: [8, 9, 10, 11, 12, 13, 14, 15, 16],
  4: [8, 9, 10, 11, 12, 13, 14, 15, 16],
  5: [8, 9, 10, 11, 12, 13, 14, 15],
  6: [8, 9, 10, 11, 12, 13, 14, 15],
  7: [8, 9, 10, 11, 12, 13, 14, 15],
  8: [8, 9, 10, 11, 12, 13, 14, 15],
  9: [8, 9, 10, 11, 12, 13, 14, 15],
  10: [8, 9, 10, 11, 12, 13, 14, 15],
  11: [8, 9, 10, 11, 12, 13, 14, 15, 16],
  12: [8, 9, 10, 11, 12, 13, 14, 15, 16],
};

const PLAN_HOURS_ZONE2_2026 = {
  1: [5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17],
  2: [5, 6, 7, 8, 12, 13, 14, 15, 16, 17],
  3: [5, 6, 7, 8, 13, 14, 15, 16, 17],
  4: [5, 6, 7, 8, 13, 14, 15, 16, 17],
  5: [5, 6, 7, 8, 13, 14, 15, 16, 17],
  6: [5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17],
  7: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  8: [5, 6, 7, 8, 9, 10, 14, 15, 16, 17],
  9: [5, 6, 7, 8, 13, 14, 15, 16, 17],
  10: [5, 6, 7, 8, 12, 13, 14, 15, 16, 17],
  11: [5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17],
  12: [5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17],
};

const PLAN_HOURS_BY_PRICE_ZONE = {
  1: PLAN_HOURS_ZONE1_2026,
  2: PLAN_HOURS_ZONE2_2026,
};

const FSK_TRANSMISSION_TARIFF_2026 = {
  sourceName: "Приказ ФАС России от 09.12.2025 N 1052/25",
  sourceUrl: "https://rg.ru/documents/2025/12/16/fas-prikaz1052-25-site-dok.html",
  lossSourceName: "Приказ ФАС России от 09.12.2025 N 1056/25, приложения 2-3",
  lossSourceUrl: "https://bazanpa.ru/fas-rossii-prikaz-n105625-ot09122025-h6951964/",
  differentialRegions: [
    "Республика Дагестан",
    "Республика Ингушетия",
    "Кабардино-Балкарская Республика",
    "Карачаево-Черкесская Республика",
    "Республика Северная Осетия - Алания",
    "Чеченская Республика",
    "Ставропольский край",
  ],
  general: [
    { periodStart: "01.01.2026", periodEnd: "30.09.2026", maintenanceRubMwMonth: 322592.31 },
    { periodStart: "01.10.2026", periodEnd: "31.12.2026", maintenanceRubMwMonth: 374207.08 },
  ],
  differential: [
    { periodStart: "01.01.2026", periodEnd: "30.09.2026", maintenanceRubMwMonth: 126657.56 },
    { periodStart: "01.10.2026", periodEnd: "31.12.2026", maintenanceRubMwMonth: 146922.77 },
  ],
};

const PRICE_ZONE_BY_REGION = {
  "тверская область": 1,
  "москва и московская область": 1,
  "г. москва": 1,
  "москва": 1,
  "московская область": 1,
  "г. санкт-петербург": 1,
  "санкт-петербург": 1,
  "ленинградская область": 1,
  "тюменская область": 1,
  "тюменская область( в т.ч. хмао и янао)": 1,
  "ханты-мансийский автономный округ (югра)": 1,
  "ямало-ненецкий автономный округ": 1,
  "красноярский край": 2,
  "иркутская область": 2,
};

const REGION_NAME_ALIASES = {
  "москва": "г. Москва",
  "город москва": "г. Москва",
  "москва и московская область": "г. Москва",
  "московская область / г. москва": "Московская область",
  "санкт-петербург": "г. Санкт-Петербург",
  "город санкт-петербург": "г. Санкт-Петербург",
  "ленинградская область / г. санкт-петербург": "Ленинградская область",
  "тюменская область( в т.ч. хмао и янао)": "Тюменская область",
  "кемеровская область (г. юрга)": "Кемеровская область",
  "нижегородская область (г. арзамас)": "Нижегородская область",
  "свердловская область (невьянский городской округ и городской округ верх-нейвинский)": "Свердловская область",
  "ямало-ненецкий автономный округ (красноселькупский район)": "Ямало-Ненецкий автономный округ",
};

const REGION_SOURCE_ALIASES = {
  network: {
    "тюменская область": ["Тюменская область( в т.ч. ХМАО и ЯНАО)"],
    "ханты-мансийский автономный округ (югра)": ["Тюменская область( в т.ч. ХМАО и ЯНАО)"],
    "ямало-ненецкий автономный округ": ["Тюменская область( в т.ч. ХМАО и ЯНАО)"],
  },
  sales: {
    "тюменская область": ["Тюменская область( в т.ч. ХМАО и ЯНАО)"],
  },
  gas: {
    "г. москва": ["Московская область / г. Москва"],
    "московская область": ["Московская область / г. Москва"],
    "г. санкт-петербург": ["Ленинградская область / г. Санкт-Петербург"],
    "ленинградская область": ["Ленинградская область / г. Санкт-Петербург"],
    "кемеровская область": ["Кемеровская область (г. Юрга)"],
    "нижегородская область": ["Нижегородская область (г. Арзамас)"],
    "свердловская область": ["Свердловская область (Невьянский городской округ и городской округ Верх-Нейвинский)"],
    "ямало-ненецкий автономный округ": ["Ямало-Ненецкий автономный округ (Красноселькупский район)"],
  },
};

const GASIFICATION_REFERENCE = {
  nationalPct: 74.7,
  technicalPct: 90.1,
  asOf: "01.01.2025",
  sourceName: "Отчет о социальной деятельности Группы Газпром за 2024 год",
  sourceUrl: "https://sustainability.gazpromreport.ru/2024/regional-social-and-economic-development/initial-and-further-gas-infrastructure-expansion/",
};

const GASIFICATION_LEVEL_BY_REGION = {};

const FACT_PEAK_HOURS_REGISTRY = {
  "красноярский край|пао красноярскэнергосбыт|2026-04": {
    kind: "fact",
    source: "АТС calcfacthour, локальный market.db",
    note: "Часы сохранены в 1-based нотации источника; расчет использует N-1.",
    daily: {
      "2026-04-01": 17, "2026-04-02": 17, "2026-04-03": 8, "2026-04-06": 8, "2026-04-07": 8, "2026-04-08": 6,
      "2026-04-09": 17, "2026-04-10": 6, "2026-04-13": 7, "2026-04-14": 6, "2026-04-15": 17, "2026-04-16": 8,
      "2026-04-17": 8, "2026-04-20": 6, "2026-04-21": 6, "2026-04-22": 8, "2026-04-23": 8, "2026-04-24": 13,
      "2026-04-27": 8, "2026-04-28": 6, "2026-04-29": 7, "2026-04-30": 8,
    },
  },
};

const HOURS24 = Array.from({ length: 24 }, (_, i) => i);
const PRICE_CATEGORIES = [1, 2, 3, 4, 5, 6];
const CK4_PERIODS = ["2026-04", "2026-03", "2026-02", "2026-01", "2025-12"];
const PUNC_MONTH_SLUGS = {
  "01": "yanvar",
  "02": "fevral",
  "03": "mart",
  "04": "aprel",
  "05": "may",
  "06": "iyun",
  "07": "iyul",
  "08": "avgust",
  "09": "sentyabr",
  "10": "oktyabr",
  "11": "noyabr",
  "12": "dekabr",
};

const LOCAL_PUNC_CATEGORY_FILES = {
  "2026-04": { 1: "1tsk_-aprel-2026.xlsx", 2: "2tsk_-aprel-2026.xlsx", 3: "3tsk_-aprel-2026.xlsx", 4: "4tsk_-aprel-2026.xlsx", 5: "5tsk_-aprel-2026.xlsx", 6: "6tsk_-aprel-2026.xlsx" },
  "2026-03": { 1: "1tsk_-mart-2026.xlsx", 2: "2tsk_-mart-2026.xlsx", 3: "3tsk_-mart-2026.xlsx", 4: "4tsk_-mart-2026.xls", 5: "5tsk_-mart-2026.xls", 6: "6tsk_-mart-2026.xls" },
  "2026-02": { 1: "1tsk_-fevral-2026.xlsx", 2: "2tsk_-fevral-2026.xlsx", 3: "3tsk_-fevral-2026.xlsx", 4: "4tsk_-fevral-2026.xls", 5: "5tsk_-fevral-2026.xls", 6: "6tsk_-fevral-2026.xls" },
  "2026-01": { 1: "1tsk_-yanvar-2026.xlsx", 2: "2tsk_-yanvar-2026.xlsx", 3: "3tsk_-yanvar-2026.xlsx", 4: "4tsk_-yanvar-2026.xls", 5: "5tsk_-yanvar-2026.xls", 6: "6tsk_-yanvar-2026.xls" },
  "2025-12": { 1: "1tsk_-dekabr-2025.xlsx", 2: "2tsk_-dekabr-2025.xlsx", 3: "3tsk_-dekabr-2025.xlsx", 4: "4tsk_-dekabr-2025.xls", 5: "5tsk_-dekabr-2025.xls", 6: "6tsk_-dekabr-2025.xls" },
};

const GP_SITE_OVERRIDES = {
  "пао красноярскэнергосбыт": "https://krsk-sbit.ru/",
  "ооо иркутскэнергосбыт": "https://sbyt.irkutskenergo.ru/",
  "ао мосэнергосбыт": "https://www.mosenergosbyt.ru/",
};

const GP_REGION_SITE_OVERRIDES = {
  "тверская область|ао росатом энергосбыт": "https://atomsbt.ru/tver/",
  "тверская область|ао атомэнергосбыт": "https://atomsbt.ru/tver/",
};

const GP_PUNC_PAGE_OVERRIDES = {
  "тверская область|ао росатом энергосбыт": "https://atomsbt.ru/raskrytie-informatsii/tver/predelnye-urovni-nereguliruemykh-tsen/",
  "тверская область|ао атомэнергосбыт": "https://atomsbt.ru/raskrytie-informatsii/tver/predelnye-urovni-nereguliruemykh-tsen/",
};

const GP_PUNC_PERIOD_OVERRIDES = {
  "тверская область|ао росатом энергосбыт": ["2026-04", "2026-03", "2026-02"],
  "тверская область|ао атомэнергосбыт": ["2026-04", "2026-03", "2026-02"],
};

const OREM_GP_REGISTRY = [
  { id: "gp-kes", name: "ПАО Красноярскэнергосбыт", inn: "2466132221", zoneCode: "KRS", priceZone: 2, territory: "Красноярский край", lat: 56.0106, lon: 92.8526, status: "active", confidence: 82, source: "Совет рынка" },
  { id: "gp-rosatom-tver", name: "АО Росатом Энергосбыт", inn: "", zoneCode: "TVE", priceZone: 1, territory: "Тверская область", lat: 56.8587, lon: 35.9176, status: "active", confidence: 72, source: "официальная страница раскрытия ГП" },
  { id: "gp-irk", name: "ООО Иркутскэнергосбыт", inn: "3808117894", zoneCode: "IRK", priceZone: 2, territory: "Иркутская область", lat: 52.2864, lon: 104.2807, status: "draft", confidence: 64, source: "ручной импорт" },
  { id: "gp-mos", name: "АО Мосэнергосбыт", inn: "7736520080", zoneCode: "MOS", priceZone: 1, territory: "г. Москва", lat: 55.7558, lon: 37.6176, status: "active", confidence: 78, source: "Совет рынка" },
  { id: "gp-mos-oblast", name: "АО Мосэнергосбыт", inn: "7736520080", zoneCode: "MOO", priceZone: 1, territory: "Московская область", lat: 55.5043, lon: 38.0354, status: "draft", confidence: 70, source: "сбытовые надбавки / реестр ОРЭМ" },
];

const OREM_NODE_REGISTRY = [
  {
    id: "node-kras-330", gpId: "gp-kes", nodeId: "330_KRS_001", name: "Красноярск 330 кВ", voltage: "330 кВ",
    lat: 56.037, lon: 92.934, source: "АТС", status: "unconfirmed", quality: 72,
    rsv: [2380,2318,2260,2224,2251,2390,2604,2740,2816,2868,2910,2874,2742,2658,2674,2728,2814,2892,3020,3148,3074,2896,2748,2630],
  },
  {
    id: "node-kes-zone", gpId: "gp-kes", nodeId: "KRS_GP_ZONE", name: "Зона ГП Красноярскэнергосбыт", voltage: "агрегат",
    lat: 56.0106, lon: 92.8526, source: "Совет рынка", status: "confirmed", quality: 88,
    rsv: [2142,2086,2024,1990,2010,2148,2360,2488,2522,2532,2564,2520,2410,2356,2378,2410,2478,2562,2678,2744,2680,2548,2412,2294],
  },
  {
    id: "node-zavodskaya-110", gpId: "gp-kes", nodeId: "1000093", name: "ПС 220 кВ Заводская СШ 110кВ", voltage: "110 кВ",
    lat: 55.9947628, lon: 93.0013017, source: "АТС: карта узлов РСВ", status: "unconfirmed", quality: 82, mappingStatus: "passport-preferred",
    comment: "Рабочий кандидат из исходного модуля РУЦ/ОРЭМ: паспорт площадки указывает ПС «Заводская» и оборудование 110 кВ.",
    rsv: [1802.26,1816.29,1823.16,1799.11,1805.32,1847.74,1866.39,1868.1,1879.75,1905.3,1911.86,1907.27,1904.53,1903.18,1903.9,1892.16,1889.98,1903.03,1898.59,1903.94,1896.12,1854.69,1820.47,1796.08],
  },
  {
    id: "node-volk-110", gpId: "gp-kes", nodeId: "110_KRS_002", name: "Волковская 110 кВ", voltage: "110 кВ",
    lat: 56.085, lon: 92.77, source: "АТС", status: "confirmed", quality: 91,
    rsv: [2310,2260,2198,2162,2180,2330,2540,2662,2728,2768,2815,2760,2642,2584,2608,2650,2732,2804,2920,3030,2974,2798,2658,2532],
  },
  {
    id: "node-frz-110", gpId: "gp-kes", nodeId: "110_KRS_003", name: "Фрунзенская 110 кВ", voltage: "110 кВ",
    lat: 55.957, lon: 92.884, source: "ручной импорт", status: "unconfirmed", quality: 66,
    rsv: [2295,2236,2180,2146,2168,2300,2510,2638,2690,2730,2768,2730,2620,2554,2576,2622,2704,2780,2894,3002,2944,2772,2630,2510],
  },
  {
    id: "node-irk-zone", gpId: "gp-irk", nodeId: "IRK_GP_ZONE", name: "Зона ГП Иркутскэнергосбыт", voltage: "агрегат",
    lat: 52.2864, lon: 104.2807, source: "ручной импорт", status: "draft", quality: 62,
    rsv: [1960,1912,1878,1856,1870,1948,2072,2150,2190,2220,2245,2210,2168,2130,2146,2178,2228,2280,2354,2408,2370,2264,2140,2048],
  },
  {
    id: "node-mos-zone", gpId: "gp-mos", nodeId: "MOS_GP_ZONE", name: "Зона ГП Мосэнергосбыт", voltage: "агрегат",
    lat: 55.7558, lon: 37.6176, source: "ручной импорт", status: "draft", quality: 70,
    rsv: [3540,3468,3390,3350,3374,3490,3710,3860,3940,4005,4050,3988,3890,3814,3840,3904,3996,4110,4260,4380,4300,4104,3920,3728],
  },
  {
    id: "node-mos-oblast-zone", gpId: "gp-mos-oblast", nodeId: "MOO_GP_ZONE", name: "Зона ГП Мосэнергосбыт, Московская область", voltage: "агрегат",
    lat: 55.5043, lon: 38.0354, source: "ручной импорт", status: "draft", quality: 66,
    rsv: [3540,3468,3390,3350,3374,3490,3710,3860,3940,4005,4050,3988,3890,3814,3840,3904,3996,4110,4260,4380,4300,4104,3920,3728],
  },
];

const OREM_MARKUP_GROUPS = [
  { id: "under670", label: "Потребители менее 670 кВт", short: "< 670 кВт", current: 0.31818, future: 0.72869 },
  { id: "from670to10", label: "Потребители 670 кВт - 10 МВт", short: "670 кВт - 10 МВт", current: 0.261, future: 0.82391 },
  { id: "above10", label: "Потребители не менее 10 МВт", short: ">= 10 МВт", current: 0.261, future: 1.01605 },
];

const OREM_ADDRESS_PRESET = {
  name: "Индустриальный парк Красный Яр",
  address: "660050, г. Красноярск, ул. Кутузова, 1, стр. 41",
  lat: 55.9936204,
  lon: 92.9757798,
  gpId: "gp-kes",
  preferredNodeId: "1000093",
};

const OREM_ADDRESS_RULES = [
  { region: "Красноярский край", gpId: "gp-kes", tokens: ["краснояр", "кутузова", "красный яр", "660050"], lat: 55.9936204, lon: 92.9757798, confidence: 88, source: "локальный адресный якорь Красный Яр" },
  { region: "Иркутская область", gpId: "gp-irk", tokens: ["иркутск", "байкальск", "ангарск", "братск"], lat: 52.2864, lon: 104.2807, confidence: 62, source: "региональный центр" },
  { region: "г. Москва", gpId: "gp-mos", tokens: ["москва", "зеленоград"], lat: 55.7558, lon: 37.6176, confidence: 70, source: "региональный центр" },
  { region: "Московская область", gpId: "gp-mos-oblast", tokens: ["московская область", "химки", "подольск", "балашиха", "мытищи"], lat: 55.5043, lon: 38.0354, confidence: 68, source: "региональный центр" },
];

const DEFAULT_STATE = {
  view: "home",
  readyAt: new Date().toISOString(),
  home: {
    regionQuery: "",
    dataStatus: "регион Красноярский край подготовлен",
    lastRegionLoad: "",
  },
  context: {
    region: "Красноярский край",
    gp: "ПАО \"Красноярскэнергосбыт\"",
    period: "2026-04",
    periodStart: "01.01.2026",
    voltage: "SN-II",
    consumerGroup: "670 кВт-10 МВт",
    monthlyMwh: 720,
    connectedKw: 1000,
    poplMw: 0.25,
    pchpnMw: 0.29,
    vatRate: 22,
  },
  info: { query: "", gasGroup: "1–10 млн м³/год" },
  punc: {
    month: 4,
    year: 2026,
    priceZone: "2",
    priceCategory: "all",
    selectedGp: "ПАО Красноярскэнергосбыт",
    gpSite: "https://krsk-sbit.ru/",
    horizonMonths: 3,
    bundleStatus: "Пакет ПУНЦ не загружен",
    loadedBundle: null,
    sourceManifest: null,
    searchStatus: "поиск не запускался",
    lastUpdate: null,
    lastSearch: null,
  },
  categories: {
    energyRubMwh: 2389,
    powerRubMwMonth: 1022211.55,
    infrastructureRubMwh: 85,
    deviationPct: 4,
    balancingRubMwh: 620,
    meteringStatus: "Данные учета не загружены",
    integralFileName: "",
    intervalFileName: "",
    integralKwh: 720000,
    intervalKwh: 0,
    intervalPoints: 0,
    intervalPeakKw: 1000,
    intervalAvgKw: 1000,
    intervalWorkdayPeakKw: 1000,
    intervalPchpnKw: 290,
    intervalCoveragePct: 0,
    loadFactorPct: 72,
    analysisMode: "profile",
  },
  uptime: {
    period: "2026-04",
    voltage: "SN-II",
    mode: "night",
    transmissionTariffMode: "regional",
    fskLossRateRubMwh: 0,
    fskLossNormPct: 0,
    customHours: "0,1,2,3,18,19,20,21,22,23",
    customWorkdayHours: [0,1,2,3,18,19,20,21,22,23],
    customNonworkingHours: HOURS24,
    purchasedCapacityRubMwMonth: 1022211.55,
  },
  orem: {
    tab: "calc",
    selectedGpId: "gp-kes",
    selectedBuyerNodeId: "node-zavodskaya-110",
    selectedSellerNodeId: "node-kes-zone",
    selectedPeriod: "2026-06-06",
    periodMode: "day",
    volumeMwh: 720,
    selectedMarkupGroup: "from670to10",
    selectedMarkupPeriod: "janSep",
    activeHistoryHorizon: "365",
    addressText: "Индустриальный парк Красный Яр, г. Красноярск, ул. Кутузова, 1, стр. 41",
    coordinates: "55.9936204, 92.9757798",
    addressLookupStatus: "адрес не проверялся",
    addressLookupUpdatedAt: "",
    addressLookupConfidence: 82,
    addressLookupRegion: "Красноярский край",
    retailCapacityMw: 0.249,
    retailCapacityTariff: 1000855.34,
    oremCapacityTariff: 998316.88,
    oremInfraSoRubMwh: 2.78,
    oremInfraAtsRubMwh: 2.19,
    oremInfraCfrRubMwh: 0.52,
    oremServicesRubMwh: 95,
    intermediaryRubMwh: 130,
    rucManualRubMwh: 521.53,
  },
  generation: {
    annualDemandMwh: 42000,
    retailRubMwh: 7850,
    gridCategory: 4,
    tpCostRub: 120000000,
    tpLifeYears: 15,
    gridReserveRubKwYear: 0,
    connectionCostRub: 0,
    dgUseCategoryBenchmark: "yes",
    exportRubMwh: 3600,
    gasEngineKw: 6200,
    gasAvailabilityPct: 82,
    pvKwp: 1800,
    pvYieldKwhKwp: 1120,
    pvDirectUsePct: 95,
    bessEnabled: "no",
    bessPowerKw: 0,
    bessCapacityKwh: 0,
    dieselKw: 800,
    gasEngineRubKw: 78000,
    pvRubKwp: 72000,
    bessPowerRubKw: 21000,
    bessEnergyRubKwh: 18000,
    dieselRubKw: 36000,
    gridIntegrationRub: 82000000,
    emsRub: 34000000,
    engineeringPct: 5.5,
    constructionPct: 7,
    ownerCostsRub: 26000000,
    contingencyPct: 8,
    gasConsumptionM3Mwh: 255,
    gasRub1000m3: 7050,
    variableOmRubMwh: 520,
    fixedOmPctCapex: 2.4,
    staffRubYear: 31500000,
    capexSource: "manual",
    quoteFileName: "",
    quoteStatus: "КП поставщиков не загружены",
    quoteItems: [],
    discountRatePct: 15,
    horizonYears: 12,
    heatRecoveryPct: 38,
    usefulHeatPct: 55,
    heatValueRubMwh: 1200,
  },
};

const App = {
  state: loadState(),
  data: {
    all: window.ALL_DATA || {},
    oremHistory: null,
    ck4: {},
  },
};

let deferredInputRenderTimer = null;
let isRendering = false;

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem("kye-app-state") || "null");
    const state = deepMerge(structuredClone(DEFAULT_STATE), saved || {});
    normalizeLoadedState(state);
    return state;
  } catch {
    const state = structuredClone(DEFAULT_STATE);
    normalizeLoadedState(state);
    return state;
  }
}

function normalizeLoadedState(state){
  if(state.context?.region) state.context.region = canonicalRegionName(state.context.region);
  const uptime = state.uptime || {};
  if(num(uptime.fskLossRateRubMwh) > 100000) uptime.fskLossRateRubMwh = 0;
  if(num(uptime.fskLossNormPct) > 30) uptime.fskLossNormPct = 0;
  if(num(uptime.fskLossRateRubMwh) < 0) uptime.fskLossRateRubMwh = 0;
  if(num(uptime.fskLossNormPct) < 0) uptime.fskLossNormPct = 0;
}

function saveState(){
  localStorage.setItem("kye-app-state", JSON.stringify(App.state));
}

function registerPuncManifestImports(manifest){
  if(!manifest || !Array.isArray(manifest.periods)) return manifest;
  return {
    ...manifest,
    periods: manifest.periods.map((row) => {
      const parsed = row.parsed;
      if(parsed?.status !== "loaded"){
        return row;
      }
      App.data.ck4[row.period] = {
        status: "loaded",
        source: "official-import",
        region: App.state.context.region,
        gp: App.state.punc.selectedGp || App.state.context.gp,
        energy: parsed.energy || [],
        capacity: parsed.capacity || [],
        summary: parsed.summary || {},
      };
      return {
        ...row,
        parsed: {
          status: parsed.status,
          parser: parsed.parser,
          categories: parsed.categories || [],
          period: parsed.period,
          download: parsed.download,
          summary: parsed.summary || {},
          energyRows: (parsed.energy || []).length,
          capacityRows: (parsed.capacity || []).length,
        },
      };
    }),
  };
}

function deepMerge(base, patch){
  for(const [key, value] of Object.entries(patch || {})){
    if(value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object"){
      deepMerge(base[key], value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function esc(value){
  return String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function num(value, fallback = 0){
  const n = Number(String(value ?? "").replace(/\s+/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function rounded(value, digits = 3){
  const factor = 10 ** digits;
  return Math.round(num(value) * factor) / factor;
}

function fmtNum(value, digits = 0){
  return num(value).toLocaleString("ru-RU", { maximumFractionDigits: digits });
}

function fmtMaybe(value, digits = 2, empty = "нет"){
  const n = num(value, NaN);
  return Number.isFinite(n) && n !== 0 ? fmtNum(n, digits) : empty;
}

function fmtRub(value, digits = 0){
  return `${fmtNum(value, digits)} ₽`;
}

function fmtMln(value, digits = 1){
  const n = num(value);
  if(Math.abs(n) >= 1_000_000_000) return `${fmtNum(n / 1_000_000_000, 2)} млрд ₽`;
  return `${fmtNum(n / 1_000_000, digits)} млн ₽`;
}

function fmtPct(value, digits = 1){
  return `${fmtNum(value, digits)}%`;
}

function fmtSignedRub(value, digits = 2){
  const n = num(value);
  return `${n > 0 ? "+" : ""}${fmtNum(n, digits)} ₽`;
}

function fmtKop(valueRub, digits = 2){
  const n = num(valueRub) * 100;
  return `${n > 0 ? "+" : ""}${fmtNum(n, digits)} коп.`;
}

function mean(values){
  const clean = (values || []).map(Number).filter(Number.isFinite);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function periodLabel(period){
  const [year, month] = String(period || "").split("-");
  return month && year ? `${month}.${year}` : String(period || "—");
}

function dateLabel(date){
  return date instanceof Date && !Number.isNaN(date.valueOf())
    ? date.toLocaleDateString("ru-RU", { timeZone: "UTC" })
    : "";
}

function expectedPuncPublicationDate(period){
  const [year, month] = String(period || "").split("-").map(Number);
  if(!Number.isFinite(year) || !Number.isFinite(month)) return null;
  return new Date(Date.UTC(year, month, 15));
}

function puncPublicationWaitMessage(period, now = new Date()){
  const expected = expectedPuncPublicationDate(period);
  if(!expected || now >= expected) return "";
  return `официальная публикация ожидается до ${dateLabel(expected)}; отсутствие файла пока штатно`;
}

function hourText(hour){
  return `${String(hour).padStart(2, "0")}:00`;
}

function clampPct(value){
  return Math.max(0, Math.min(100, num(value)));
}

function icon(name){
  const attrs = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"`;
  const paths = {
    grid: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
    database: `<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>`,
    clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
    calculator: `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0"/>`,
    activity: `<path d="M3 12h4l2-6 4 12 2-6h6"/>`,
    nodes: `<circle cx="6" cy="7" r="3"/><circle cx="18" cy="7" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.6 8.8 10.8 15M15.4 8.8 13.2 15M9 7h6"/>`,
    flame: `<path d="M12 22c3.7 0 6.5-2.5 6.5-6.2 0-3-1.7-5.1-3.8-7.2-.9 2.5-2.3 3.7-3.7 4.4.5-3.2-.9-6.1-3.3-8.9C7.4 8 5.5 10.2 5.5 15.7 5.5 19.5 8.3 22 12 22Z"/><path d="M12 22c1.6 0 2.8-1.1 2.8-2.8 0-1.2-.6-2.1-1.7-3.2-.3 1-.9 1.6-1.6 2-.1-1.4-.7-2.5-1.7-3.6-.8 1.7-1.4 2.8-1.4 4.8C8.4 20.9 10.3 22 12 22Z"/>`,
    bolt: `<path d="M13 2 4 14h7l-1 8 10-13h-7z"/>`,
    menu: `<path d="M4 6h16M4 12h16M4 18h16"/>`,
    link: `<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/>`,
    search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  };
  return `<svg ${attrs}>${paths[name] || paths.grid}</svg>`;
}

function setView(view){
  App.state.view = view;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function setValue(path, value){
  const keys = path.split(".");
  let cursor = App.state;
  while(keys.length > 1) cursor = cursor[keys.shift()];
  cursor[keys[0]] = value;
  saveState();
  render();
}

function updateInput(path, parser = (v) => v){
  return `data-path="${esc(path)}" data-parser="${parser.name || "raw"}"`;
}

function readPath(path){
  return path.split(".").reduce((acc, key) => acc == null ? undefined : acc[key], App.state);
}

function sourceStatus(){
  const all = App.data.all || {};
  const network = Array.isArray(all.network) ? all.network.length : 0;
  const sales = Array.isArray(all.sales) ? all.sales.length : 0;
  const gas = Array.isArray(all.gas) ? all.gas.length : 0;
  return { network, sales, gas, ok: network + sales + gas > 0 };
}

function canonicalRegionName(region){
  const raw = String(region || "").trim();
  if(!raw) return "";
  return REGION_NAME_ALIASES[cleanSupplierName(raw)] || raw;
}

function regionSourceNames(region, sourceKind){
  const canonical = canonicalRegionName(region);
  const names = new Set([canonical]);
  const aliases = REGION_SOURCE_ALIASES[sourceKind]?.[cleanSupplierName(canonical)] || [];
  aliases.forEach((name) => names.add(name));
  return names;
}

function rowsForRegion(rows, region, sourceKind){
  const keys = new Set(Array.from(regionSourceNames(region, sourceKind)).map(cleanSupplierName));
  return (rows || []).filter((r) => keys.has(cleanSupplierName(r.region)));
}

function regionSearchText(region){
  const canonical = canonicalRegionName(region);
  const text = cleanSupplierName(canonical);
  const aliases = [];
  if(text === "г. москва") aliases.push("москва московский московская");
  if(text === "московская область") aliases.push("москва московская мо");
  if(text === "г. санкт-петербург") aliases.push("санкт-петербург санкт петербург спб");
  if(text === "ленинградская область") aliases.push("ленинградская ленобласть санкт-петербург спб");
  return [text, ...aliases].join(" ");
}

function regionMatchesQuery(region, query){
  const normalizedQuery = cleanSupplierName(query);
  return !normalizedQuery || regionSearchText(region).includes(normalizedQuery);
}

function getRegions(){
  const all = App.data.all || {};
  const names = new Set();
  (all.network || []).forEach((r) => names.add(canonicalRegionName(r.region)));
  (all.sales || []).forEach((r) => names.add(canonicalRegionName(r.region)));
  (all.gas || []).forEach((r) => names.add(canonicalRegionName(r.region)));
  OREM_GP_REGISTRY.forEach((r) => names.add(canonicalRegionName(r.territory)));
  return Array.from(names).filter(Boolean).sort((a, b) => a.localeCompare(b, "ru"));
}

function selectedNetworkRows(){
  const ctx = App.state.context;
  return rowsForRegion(App.data.all.network, ctx.region, "network");
}

function selectedNetworkRow(period = App.state.context.period || puncPeriod()){
  const rows = selectedNetworkRows();
  return rows.find((r) => r.period_start === tariffPeriodStart(period)) || rows[0] || null;
}

function selectedSalesRows(){
  const ctx = App.state.context;
  return rowsForRegion(App.data.all.sales, ctx.region, "sales");
}

function selectedSalesRow(period = App.state.context.period || puncPeriod()){
  const ctx = App.state.context;
  const rows = selectedSalesRows().filter((r) => periodContains(r, period));
  const gp = cleanSupplierName(ctx.gp || App.state.punc.selectedGp);
  return rows.find((r) => cleanSupplierName(r.guaranteeing_supplier).includes(gp) && consumerGroupMatches(r.consumer_subgroup, ctx.consumerGroup)) ||
    rows.find((r) => consumerGroupMatches(r.consumer_subgroup, ctx.consumerGroup)) ||
    rows.find((r) => cleanSupplierName(r.guaranteeing_supplier).includes("красноярскэнергосбыт")) ||
    rows[0] || null;
}

function selectedGasRows(){
  const ctx = App.state.context;
  return rowsForRegion(App.data.all.gas, ctx.region, "gas");
}

function selectedGasRow(){
  const rows = selectedGasRows();
  const preferred = rows.filter((r) => String(r.consumer_group || "") === App.state.info.gasGroup);
  const candidates = preferred.length ? preferred : rows;
  return candidates.find((r) => gasPriceContext(r).isConfirmedFinal) ||
    candidates.find((r) => gasComponentCompleteness(r).complete) ||
    candidates[0] ||
    null;
}

function ctxPeriodStart(){
  return tariffPeriodStart(App.state.context.period || puncPeriod());
}

function periodParts(period = App.state.context.period || puncPeriod()){
  const [year, month] = String(period || "").split("-").map(Number);
  return { year: Number.isFinite(year) ? year : 2026, month: Number.isFinite(month) ? month : 1 };
}

function tariffPeriodStart(period = App.state.context.period || puncPeriod()){
  const { year, month } = periodParts(period);
  if(year === 2026 && month >= 10) return "01.10.2026";
  return "01.01.2026";
}

function periodContains(row, period = App.state.context.period || puncPeriod()){
  const { year, month } = periodParts(period);
  const target = new Date(Date.UTC(year, month - 1, 1));
  const start = parseRuDate(row?.period_start || "01.01.2026");
  const end = parseRuDate(row?.period_end || "31.12.2026");
  return (!start || target >= start) && (!end || target <= end);
}

function parseRuDate(value){
  const match = String(value || "").match(/(\d{1,2})[.](\d{1,2})[.](20\d{2})/);
  return match ? new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]))) : null;
}

function consumerGroupMatches(rowGroup, contextGroup){
  const row = cleanSupplierName(rowGroup);
  const ctx = cleanSupplierName(contextGroup);
  if(!row || !ctx) return false;
  if(ctx.includes("670") && ctx.includes("10") && row.includes("670") && row.includes("10")) return true;
  if(ctx.includes("до 670") && row.includes("до 670")) return true;
  if(ctx.includes("10") && !ctx.includes("670") && row.includes("10")) return true;
  return row.includes(ctx) || ctx.includes(row);
}

function voltageSuffix(voltage = App.state.context.voltage){
  return { "VN": "vn", "SN-I": "sn1", "SN-II": "sn2", "NN": "nn" }[voltage] || "sn2";
}

function voltageLabel(voltage = App.state.context.voltage){
  return { "VN": "ВН", "SN-I": "СН-I", "SN-II": "СН-II", "NN": "НН" }[voltage] || voltage;
}

function networkRates(row = selectedNetworkRow(), voltage = App.state.context.voltage){
  const suffix = voltageSuffix(voltage);
  return {
    maintenanceRubMwMonth: num(row?.[`maintenance_${suffix}_rub_mw_month`]),
    lossesRubMwh: num(row?.[`losses_${suffix}_rub_mwh`]),
    singleRubKwh: num(row?.[`single_${suffix}_rub_kwh`]),
  };
}

function isFskDifferentialRegion(region = App.state.context.region){
  const key = cleanSupplierName(region);
  return FSK_TRANSMISSION_TARIFF_2026.differentialRegions.some((item) => cleanSupplierName(item) === key);
}

function fskTransmissionTariff(period = App.state.context.period || puncPeriod(), region = App.state.context.region){
  const tierKey = isFskDifferentialRegion(region) ? "differential" : "general";
  const rows = FSK_TRANSMISSION_TARIFF_2026[tierKey] || FSK_TRANSMISSION_TARIFF_2026.general;
  const start = tariffPeriodStart(period);
  const row = rows.find((item) => item.periodStart === start) || rows[0];
  return {
    ...row,
    tierKey,
    tierLabel: tierKey === "differential" ? "дифференцированная группа" : "общая группа субъектов РФ",
    sourceName: FSK_TRANSMISSION_TARIFF_2026.sourceName,
    sourceUrl: FSK_TRANSMISSION_TARIFF_2026.sourceUrl,
    lossSourceName: FSK_TRANSMISSION_TARIFF_2026.lossSourceName,
    lossSourceUrl: FSK_TRANSMISSION_TARIFF_2026.lossSourceUrl,
  };
}

function fskTransmissionEquivalent({
  period = App.state.context.period || puncPeriod(),
  region = App.state.context.region,
  volumeKwh = num(App.state.context.monthlyMwh) * 1000,
  capacityKw = num(App.state.context.pchpnMw) * 1000 || num(App.state.context.connectedKw),
  lossRateRubMwh = num(App.state.uptime.fskLossRateRubMwh),
  lossNormPct = num(App.state.uptime.fskLossNormPct),
} = {}){
  const tariff = fskTransmissionTariff(period, region);
  const safeVolumeKwh = Math.max(0, num(volumeKwh));
  const safeCapacityKw = Math.max(0, num(capacityKw));
  const safeLossRate = Math.max(0, Math.min(100000, num(lossRateRubMwh)));
  const safeLossNorm = Math.max(0, Math.min(30, num(lossNormPct)));
  const volumeMwh = safeVolumeKwh / 1000;
  const lossVolumeMwh = volumeMwh * safeLossNorm / 100;
  const maintenanceCostRub = safeCapacityKw / 1000 * tariff.maintenanceRubMwMonth;
  const lossCostRub = lossVolumeMwh * safeLossRate;
  const totalCostRub = maintenanceCostRub + lossCostRub;
  return {
    ...tariff,
    volumeKwh: safeVolumeKwh,
    capacityKw: safeCapacityKw,
    lossRateRubMwh: safeLossRate,
    lossNormPct: safeLossNorm,
    lossVolumeMwh,
    maintenanceCostRub,
    lossCostRub,
    totalCostRub,
    maintenanceRubKwh: safeVolumeKwh ? maintenanceCostRub / safeVolumeKwh : 0,
    lossRubKwh: safeVolumeKwh ? lossCostRub / safeVolumeKwh : 0,
    totalRubKwh: safeVolumeKwh ? totalCostRub / safeVolumeKwh : 0,
  };
}

function currentMarkupRubKwh(period = App.state.context.period || puncPeriod()){
  return num(selectedSalesRow(period)?.sales_markup_rub_kwh_ex_vat, 0.36);
}

function currentGasRub1000(period = App.state.context.period || puncPeriod()){
  const gas = selectedGasRow();
  return gasPriceContext(gas, period, App.state.generation.gasRub1000m3).valueRub1000;
}

function gasPriceRub1000(row, period = App.state.context.period || puncPeriod(), fallback = 0){
  return gasPriceContext(row, period, fallback).valueRub1000;
}

function gasComponentCompleteness(row){
  const components = {
    wholesale: num(row?.wholesale_h2_rub_1000m3_ex_vat, NaN),
    pssu: num(row?.pssu_rub_1000m3, NaN),
    transport: num(row?.gro_rub_1000m3, NaN),
    specialMarkup: num(row?.special_markup_rub_1000m3, NaN),
  };
  const present = Object.values(components).filter((value) => Number.isFinite(value) && value > 0).length;
  const match = String(row?.component_completeness || "").match(/(\d+)\s*\/\s*(\d+)/);
  const declaredPresent = match ? Number(match[1]) : present;
  const declaredTotal = match ? Number(match[2]) : 4;
  return {
    ...components,
    present: declaredPresent,
    total: declaredTotal || 4,
    complete: declaredPresent >= 4 || present >= 4,
    componentSum: Object.values(components).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0),
  };
}

function gasPriceContext(row, period = App.state.context.period || puncPeriod(), fallback = 0){
  const { month } = periodParts(period);
  const half = month >= 10 ? "h2" : "h1";
  const exactKey = `final_${half}_ex_vat_rub_1000m3`;
  const exactVatKey = `final_${half}_inc_vat22_rub_1000m3`;
  const otherHalf = half === "h2" ? "h1" : "h2";
  const otherKey = `final_${otherHalf}_ex_vat_rub_1000m3`;
  const exact = num(row?.[exactKey], NaN);
  const exactVat = num(row?.[exactVatKey], NaN);
  const other = num(row?.[otherKey], NaN);
  const components = gasComponentCompleteness(row);
  const fallbackValue = num(fallback);
  const isConfirmedFinal = Number.isFinite(exact) && exact > 0;
  if(isConfirmedFinal){
    return {
      row,
      period,
      half,
      valueRub1000: exact,
      valueWithVatRub1000: Number.isFinite(exactVat) && exactVat > 0 ? exactVat : exact * (1 + num(App.state.context.vatRate, 22) / 100),
      status: "loaded",
      basis: `${half.toUpperCase()} итоговая цена без НДС`,
      warning: "",
      isConfirmedFinal: true,
      components,
    };
  }
  if(components.complete && components.componentSum > 0){
    return {
      row,
      period,
      half,
      valueRub1000: components.componentSum,
      valueWithVatRub1000: components.componentSum * (1 + num(App.state.context.vatRate, 22) / 100),
      status: "computed",
      basis: "сумма подтвержденных H2-компонентов",
      warning: half === "h1" ? "для H1 в базе нет отдельной итоговой цены; применена компонентная H2-база" : "",
      isConfirmedFinal: false,
      components,
    };
  }
  if(Number.isFinite(other) && other > 0){
    return {
      row,
      period,
      half,
      valueRub1000: other,
      valueWithVatRub1000: other * (1 + num(App.state.context.vatRate, 22) / 100),
      status: "period-fallback",
      basis: `${otherHalf.toUpperCase()} итоговая цена без НДС`,
      warning: `для ${half.toUpperCase()} в базе нет итоговой цены; показана доступная ${otherHalf.toUpperCase()}-цена`,
      isConfirmedFinal: false,
      components,
    };
  }
  return {
    row,
    period,
    half,
    valueRub1000: fallbackValue,
    valueWithVatRub1000: fallbackValue * (1 + num(App.state.context.vatRate, 22) / 100),
    status: row ? "manual-fallback" : "empty",
    basis: row ? "ручная цена из модели генерации" : "нет газовой строки региона",
    warning: row ? "компоненты газа неполные; автоматическая цена не применяется в генерации" : "газовые данные по региону не найдены",
    isConfirmedFinal: false,
    components,
  };
}

function gasPriceStatusLabel(status){
  return {
    loaded: "итоговая цена",
    computed: "сумма компонентов",
    "period-fallback": "другой период",
    "manual-fallback": "ручной fallback",
    empty: "нет данных",
  }[status] || status || "draft";
}

function gasificationInfo(region = App.state.context.region){
  const key = cleanSupplierName(canonicalRegionName(region));
  const regional = GASIFICATION_LEVEL_BY_REGION[key] || null;
  const gasRows = rowsForRegion(App.data.all.gas, region, "gas");
  const gros = gasDistributorRowsForRegion(region);
  const zones = new Set(gasRows.map((row) => row.gro_service_zone || row.wholesale_scope || row.region).filter(Boolean));
  return {
    region: canonicalRegionName(region),
    regional,
    regionalPct: Number.isFinite(regional?.pct) ? regional.pct : null,
    status: Number.isFinite(regional?.pct) ? "loaded" : "draft",
    label: Number.isFinite(regional?.pct) ? `${fmtNum(regional.pct, 1)}%` : "не загружен",
    detail: Number.isFinite(regional?.pct)
      ? `${regional.asOf || "дата не указана"} · ${regional.sourceName || "источник не указан"}`
      : "в базе пока нет подтвержденного процента газификации субъекта",
    nationalPct: GASIFICATION_REFERENCE.nationalPct,
    technicalPct: GASIFICATION_REFERENCE.technicalPct,
    nationalAsOf: GASIFICATION_REFERENCE.asOf,
    sourceName: regional?.sourceName || GASIFICATION_REFERENCE.sourceName,
    sourceUrl: regional?.sourceUrl || GASIFICATION_REFERENCE.sourceUrl,
    gasRows: gasRows.length,
    groCount: gros.length,
    zoneCount: zones.size,
  };
}

function monthDays(year, month){
  return new Date(year, month, 0).getDate();
}

function isRuHoliday2026(date){
  const iso = date.toISOString().slice(0, 10);
  return ["2026-01-01","2026-01-02","2026-01-03","2026-01-04","2026-01-05","2026-01-06","2026-01-07","2026-01-08","2026-01-09","2026-02-23","2026-03-09","2026-05-01","2026-05-11","2026-06-12","2026-11-04","2026-12-31"].includes(iso);
}

function isWorkingDay(date){
  const day = date.getDay();
  return day !== 0 && day !== 6 && !isRuHoliday2026(date);
}

function workingDays(year, month){
  const out = [];
  for(let d = 1; d <= monthDays(year, month); d += 1){
    const date = new Date(Date.UTC(year, month - 1, d));
    if(isWorkingDay(date)) out.push(d);
  }
  return out;
}

function parseHours(value){
  return String(value || "")
    .replace(/;/g, ",")
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v, i, arr) => Number.isInteger(v) && v >= 0 && v <= 23 && arr.indexOf(v) === i)
    .sort((a, b) => a - b);
}

function cleanHours(hours, fallback = []){
  const source = Array.isArray(hours) ? hours : parseHours(hours);
  const out = source.map(Number).filter((v, i, arr) => Number.isInteger(v) && v >= 0 && v <= 23 && arr.indexOf(v) === i);
  return out.length ? out.sort((a, b) => a - b) : fallback.slice();
}

function priceZoneForRegion(region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  const canonicalRegion = canonicalRegionName(region);
  const regionKey = cleanSupplierName(canonicalRegion);
  const gpKey = cleanSupplierName(gp);
  const registryMatch = OREM_GP_REGISTRY.find((item) => {
    const territoryMatch = cleanSupplierName(item.territory) === regionKey;
    const gpMatch = gpKey && cleanSupplierName(item.name) === gpKey;
    return territoryMatch && (!gpKey || gpMatch);
  }) || OREM_GP_REGISTRY.find((item) => cleanSupplierName(item.territory) === regionKey);
  return num(registryMatch?.priceZone || PRICE_ZONE_BY_REGION[regionKey] || App.state.punc.priceZone, 2);
}

function priceZoneLabel(zone = priceZoneForRegion()){
  return `${num(zone, 2)}-я ценовая зона`;
}

function planHoursMapForZone(zone = priceZoneForRegion()){
  return PLAN_HOURS_BY_PRICE_ZONE[num(zone, 2)] || PLAN_HOURS_ZONE2_2026;
}

function planHoursForMonth(month = App.state.punc.month, region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  return planHoursMapForZone(priceZoneForRegion(region, gp))[num(month)] || [];
}

function planHourIndexes(month = App.state.punc.month, region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  return planHoursForMonth(month, region, gp).map((h) => h - 1);
}

function planHourLabel(month = App.state.punc.month, region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  return planHoursForMonth(month, region, gp).join(", ");
}

function csvParse(text){
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const firstLine = String(text || "").split(/\r?\n/).find((line) => line.trim()) || "";
  const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";
  for(let i = 0; i < text.length; i += 1){
    const ch = text[i];
    if(ch === '"'){
      if(quoted && text[i + 1] === '"'){
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if(ch === delimiter && !quoted){
      row.push(cell);
      cell = "";
    } else if((ch === "\n" || ch === "\r") && !quoted){
      if(ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if(row.some((v) => v !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if(row.some((v) => v !== "")) rows.push(row);
  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function cleanSupplierName(value){
  return String(value || "").replace(/[«»"]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function gpRegionOverrideKey(region, name){
  return `${cleanSupplierName(region)}|${cleanSupplierName(name)}`;
}

function defaultGpSite(name, region = App.state.context.region){
  const source = cleanSupplierName(name);
  const regional = GP_REGION_SITE_OVERRIDES[gpRegionOverrideKey(region, name)];
  if(regional) return regional;
  if(GP_SITE_OVERRIDES[source]) return GP_SITE_OVERRIDES[source];
  if(source.includes("красноярскэнергосбыт")) return "https://krsk-sbit.ru/";
  if(source.includes("иркутскэнергосбыт")) return "https://sbyt.irkutskenergo.ru/";
  if(source.includes("мосэнергосбыт")) return "https://www.mosenergosbyt.ru/";
  return "";
}

function puncDisclosurePageFor(gp = App.state.punc.selectedGp || App.state.context.gp, region = App.state.context.region){
  return GP_PUNC_PAGE_OVERRIDES[gpRegionOverrideKey(region, gp)] || "";
}

function puncPublishedPeriodsFor(gp = App.state.punc.selectedGp || App.state.context.gp, region = App.state.context.region){
  return GP_PUNC_PERIOD_OVERRIDES[gpRegionOverrideKey(region, gp)] || [];
}

function gpRowsForRegion(region = App.state.context.region){
  const byName = new Map();
  rowsForRegion(App.data.all.sales, region, "sales")
    .forEach((r) => {
      const name = r.guaranteeing_supplier || "ГП не указан";
      const key = cleanSupplierName(name);
      const current = byName.get(key);
      if(current){
        current.groups.add(r.consumer_subgroup || "группа не указана");
        current.markups.push(num(r.sales_markup_rub_kwh_ex_vat));
      } else {
        byName.set(key, {
          name,
          groups: new Set([r.consumer_subgroup || "группа не указана"]),
          markups: [num(r.sales_markup_rub_kwh_ex_vat)],
          period: [r.period_start, r.period_end].filter(Boolean).join("-"),
          site: defaultGpSite(name, region),
          source: "сбытовые надбавки",
          status: "loaded",
        });
      }
    });
  OREM_GP_REGISTRY
    .filter((r) => canonicalRegionName(r.territory) === canonicalRegionName(region))
    .forEach((r) => {
      const key = cleanSupplierName(r.name);
      if(!byName.has(key)){
        byName.set(key, {
          name: r.name,
          groups: new Set(["реестр ОРЭМ"]),
          markups: [],
          period: "",
          site: defaultGpSite(r.name, region),
          source: r.source,
          status: r.status,
        });
      }
    });
  return Array.from(byName.values()).map((r) => ({
    ...r,
    groups: Array.from(r.groups),
    avgMarkupRubKwh: r.markups.length ? r.markups.reduce((a, b) => a + b, 0) / r.markups.length : 0,
  }));
}

function gasDistributorRowsForRegion(region = App.state.context.region){
  const byName = new Map();
  rowsForRegion(App.data.all.gas, region, "gas")
    .forEach((r) => {
      const name = r.gro || r.supplier || "ГРО не указана";
      const key = cleanSupplierName(name);
      const current = byName.get(key);
      if(current){
        current.groups.add(r.consumer_group || "группа не указана");
        current.zones.add(r.gro_service_zone || r.wholesale_scope || region);
        current.statuses.add(r.verification_status || r.final_price_status || r.data_tier || "draft");
      } else {
        byName.set(key, {
          name,
          supplier: r.supplier || "",
          groups: new Set([r.consumer_group || "группа не указана"]),
          zones: new Set([r.gro_service_zone || r.wholesale_scope || region]),
          statuses: new Set([r.verification_status || r.final_price_status || r.data_tier || "draft"]),
          source: r.source_name || "газовый тарифный модуль",
        });
      }
    });
  return Array.from(byName.values()).map((r) => ({
    ...r,
    groups: Array.from(r.groups),
    zones: Array.from(r.zones),
    statuses: Array.from(r.statuses),
  }));
}

function regionalDataStatus(region = App.state.context.region){
  const canonicalRegion = canonicalRegionName(region);
  const network = rowsForRegion(App.data.all.network, canonicalRegion, "network");
  const sales = rowsForRegion(App.data.all.sales, canonicalRegion, "sales");
  const gas = rowsForRegion(App.data.all.gas, canonicalRegion, "gas");
  const gp = gpRowsForRegion(region);
  const gro = gasDistributorRowsForRegion(region);
  return {
    region: canonicalRegion,
    network,
    sales,
    gas,
    gp,
    gro,
    ready: network.length > 0 && sales.length > 0 && gas.length > 0 && gp.length > 0,
  };
}

function applyRegionSelection(region){
  if(!region) return;
  App.state.context.region = canonicalRegionName(region);
  App.state.context.periodStart = tariffPeriodStart(App.state.context.period || puncPeriod());
  syncPuncGpWithRegion();
  App.state.punc.priceZone = String(priceZoneForRegion(App.state.context.region, App.state.punc.selectedGp || App.state.context.gp));
  const status = regionalDataStatus(App.state.context.region);
  App.state.home.dataStatus = status.ready
    ? `Регион ${App.state.context.region}: тарифы, ГП и ГРО загружены`
    : `Регион ${App.state.context.region}: часть данных отсутствует`;
  App.state.home.lastRegionLoad = new Date().toLocaleString("ru-RU");
  App.state.punc.loadedBundle = null;
  App.state.punc.bundleStatus = "После выбора ГП загрузите пакет ПУНЦ";
}

function syncPuncGpWithRegion(){
  const p = App.state.punc;
  const rows = gpRowsForRegion(App.state.context.region);
  const current = p.selectedGp || App.state.context.gp;
  const match = rows.find((r) => cleanSupplierName(r.name) === cleanSupplierName(current)) || rows[0];
  if(match){
    const previousDefaultSite = defaultGpSite(current, App.state.context.region);
    const knownSites = [
      ...Object.values(GP_SITE_OVERRIDES),
      ...Object.values(GP_REGION_SITE_OVERRIDES),
      ...Object.values(GP_PUNC_PAGE_OVERRIDES),
    ];
    p.selectedGp = match.name;
    App.state.context.gp = match.name;
    p.priceZone = String(priceZoneForRegion(App.state.context.region, match.name));
    if(match.site && (!p.gpSite || p.gpSite === previousDefaultSite || knownSites.includes(p.gpSite))) p.gpSite = match.site;
    if(!match.site && (p.gpSite === previousDefaultSite || knownSites.includes(p.gpSite))) p.gpSite = "";
  }
}

function puncPeriod(){
  const p = App.state.punc;
  return `${num(p.year, 2026)}-${String(num(p.month, 1)).padStart(2, "0")}`;
}

function puncRegionKey(){
  return cleanSupplierName(`${App.state.context.region} ${App.state.punc.selectedGp || App.state.context.gp}`);
}

function canUseLoadedPunc(period = puncPeriod()){
  const key = puncRegionKey();
  return CK4_PERIODS.includes(period) && key.includes("краснояр") && key.includes("энергосбыт");
}

function factPeakKey(period, region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  return cleanSupplierName(`${region}|${gp}|${period}`);
}

function peakHoursForPeriod(period, region = App.state.context.region, gp = App.state.punc.selectedGp || App.state.context.gp){
  const fact = FACT_PEAK_HOURS_REGISTRY[factPeakKey(period, region, gp)];
  if(fact){
    const hours = Array.from(new Set(Object.values(fact.daily).map(Number))).sort((a, b) => a - b);
    return { status: "loaded", kind: fact.kind, hours, daily: fact.daily, source: fact.source, note: fact.note };
  }
  const month = num(String(period || "").split("-")[1]);
  const zone = priceZoneForRegion(region, gp);
  const hours = planHoursForMonth(month, region, gp);
  return { status: hours.length ? "plan" : "draft", kind: "plan", hours, daily: null, source: `СО ЕЭС, плановые часы ${priceZoneLabel(zone)}`, note: `Плановые часы ${priceZoneLabel(zone)} используются как fallback до загрузки фактических часов зоны ГП.` };
}

function puncPeriodsForHorizon(horizonMonths = App.state.punc.horizonMonths){
  const horizon = Math.max(1, num(horizonMonths, 3));
  const publishedPeriods = puncPublishedPeriodsFor();
  if(publishedPeriods.length) return publishedPeriods.slice(0, horizon);
  const selected = puncPeriod();
  const start = Math.max(0, CK4_PERIODS.indexOf(selected));
  const baseIndex = CK4_PERIODS.includes(selected) ? start : 0;
  return CK4_PERIODS.slice(baseIndex, baseIndex + horizon);
}

function localPuncCategoryCandidates(period, category){
  const known = LOCAL_PUNC_CATEGORY_FILES[period]?.[category];
  if(known) return [`../calc-6cz-orem/data/cache/kes-pilot/${period}-01/${known}`];
  const [year, month] = String(period || "").split("-");
  const slug = PUNC_MONTH_SLUGS[month];
  if(!year || !month || !slug) return [];
  const base = `../calc-6cz-orem/data/cache/kes-pilot/${period}-01/${category}tsk_-${slug}-${year}`;
  return [`${base}.xlsx`, `${base}.xls`];
}

async function firstReachableUrl(urls){
  for(const url of urls){
    try {
      const res = await fetch(url, { method: "HEAD" });
      if(res.ok) return { status: "loaded", url };
    } catch {
      try {
        const res = await fetch(url);
        if(res.ok) return { status: "loaded", url };
      } catch {
        // ignore and try next candidate
      }
    }
  }
  return { status: "draft", url: "" };
}

function puncSearchQueryFor(period, category, gp = App.state.punc.selectedGp || App.state.context.gp){
  const label = category === "all" ? "все ценовые категории" : `${category} ценовая категория`;
  return `ПУНЦ ${period} ${label} ${gp}`;
}

function puncSearchUrlFor(period, category){
  const directPage = puncDisclosurePageFor();
  if(directPage) return directPage;
  const site = String(App.state.punc.gpSite || "").trim();
  let host = site;
  try {
    host = new URL(site.includes("://") ? site : `https://${site}`).hostname;
  } catch {
    host = site.replace(/^https?:\/\//, "").split("/")[0];
  }
  const query = host ? `site:${host} ${puncSearchQueryFor(period, category)}` : puncSearchQueryFor(period, category);
  return `https://yandex.ru/search/?text=${encodeURIComponent(query)}`;
}

function apiUrl(path, params = {}){
  if(!/^https?:$/i.test(window.location.protocol)) return "";
  const prefix = window.location.pathname.includes("/krasny-yar-energo-app/") ? "/krasny-yar-energo-app" : "";
  const query = new URLSearchParams(params);
  return `${window.location.origin}${prefix}${path}${query.toString() ? `?${query}` : ""}`;
}

async function discoverOfficialPuncSources(){
  const p = App.state.punc;
  const url = apiUrl("/api/punc/discover", {
    region: App.state.context.region,
    gp: p.selectedGp || App.state.context.gp,
    horizon: String(num(p.horizonMonths, 3)),
    import: "1",
  });
  if(!url){
    return { status: "api-unavailable", message: "Автопроверка доступна при запуске через локальный сервер приложения.", periods: [] };
  }
  const response = await fetch(url, { cache: "no-store" });
  if(!response.ok) throw new Error(`API источников ПУНЦ: ${response.status}`);
  return response.json();
}

function periodRowsFromManifest(manifest){
  return Array.isArray(manifest?.periods) ? manifest.periods.filter((row) => row?.period) : [];
}

async function loadPuncBundleForSelectedGp(){
  syncPuncGpWithRegion();
  const p = App.state.punc;
  p.bundleStatus = "проверка официального источника";
  p.searchStatus = "проверка официального источника";
  saveState();
  const useLocalCache = canUseLoadedPunc(puncPeriod());
  let manifest = null;
  if(!useLocalCache){
    try {
      manifest = registerPuncManifestImports(await discoverOfficialPuncSources());
      p.sourceManifest = manifest;
      if(manifest?.site && !p.gpSite) p.gpSite = manifest.site;
    } catch (err) {
      manifest = { status: "source-error", message: err.message, periods: [] };
      p.sourceManifest = manifest;
    }
  }
  const manifestPeriods = periodRowsFromManifest(manifest);
  const periods = manifestPeriods.length ? manifestPeriods.map((row) => row.period) : puncPeriodsForHorizon(p.horizonMonths);
  if(periods[0] && periods[0] !== puncPeriod()){
    const { year, month } = periodParts(periods[0]);
    p.year = year;
    p.month = month;
    App.state.context.period = periods[0];
    App.state.uptime.period = periods[0];
  }
  p.bundleStatus = "загрузка пакета ПУНЦ";
  p.searchStatus = "загрузка пакета ПУНЦ";
  saveState();
  const gpRow = gpRowsForRegion(App.state.context.region).find((row) => cleanSupplierName(row.name) === cleanSupplierName(p.selectedGp || App.state.context.gp));
  const directPuncPage = puncDisclosurePageFor(p.selectedGp || App.state.context.gp, App.state.context.region);
  const periodRows = [];
  for(const period of periods){
    const localSupported = canUseLoadedPunc(period);
    const categories = [];
    for(const category of PRICE_CATEGORIES){
      if(localSupported){
        const found = await firstReachableUrl(localPuncCategoryCandidates(period, category));
        categories.push({
          category,
          status: found.status,
          source: found.url || puncSearchUrlFor(period, category),
          mode: found.status === "loaded" ? "local-cache" : "official-search",
        });
      } else {
        const manifestPeriod = manifestPeriods.find((row) => row.period === period);
        const sourceUrl = manifestPeriod?.primaryUrl || directPuncPage || puncSearchUrlFor(period, category);
        const sourceFound = Boolean(manifestPeriod?.primaryUrl);
        const loadedCategories = new Set((manifestPeriod?.loadedCategories || manifestPeriod?.parsed?.categories || []).map(String));
        const parsedLoaded = manifestPeriod?.parsed?.status === "loaded" && loadedCategories.has(String(category));
        categories.push({
          category,
          status: parsedLoaded ? "loaded" : sourceFound ? "source-found" : "queued",
          source: sourceUrl,
          mode: parsedLoaded ? "official-import" : sourceFound ? "official-source" : "official-site",
          fileType: manifestPeriod?.fileType || "",
        });
      }
    }
    if(localSupported) await loadCk4Period(period);
    const peak = peakHoursForPeriod(period);
    const publicationWait = puncPublicationWaitMessage(period);
    periodRows.push({
      period,
      gp: p.selectedGp || App.state.context.gp,
      site: p.gpSite || gpRow?.site || "",
      localSupported,
      categories,
      peakHours: peak.hours,
      peakDaily: peak.daily,
      peakKind: peak.kind,
      peakStatus: peak.status,
      peakSource: peak.source,
      parsed: manifestPeriods.find((row) => row.period === period)?.parsed || null,
      source: localSupported
        ? `локальный кэш КЭС + ${peak.source}`
        : manifestPeriods.find((row) => row.period === period)?.parsed?.status === "loaded"
          ? "официальный файл загружен; 4 ЦК разобрана по шаблону Росатом/Тверь"
        : manifestPeriods.find((row) => row.period === period)?.primaryUrl
          ? "официальный файл найден; требуется шаблон разбора 1-3, 5-6 ЦК"
          : publicationWait || (directPuncPage ? "официальная страница задана; файл ПУНЦ пока не найден" : "сайт ГП задан; нужен официальный раздел раскрытия или файл ПУНЦ"),
    });
  }
  const loadedCount = periodRows.reduce((sum, row) => sum + row.categories.filter((item) => item.status === "loaded").length, 0);
  const sourceFoundCount = periodRows.reduce((sum, row) => sum + row.categories.filter((item) => item.status === "source-found").length, 0);
  const totalCount = periodRows.length * PRICE_CATEGORIES.length;
  const status = loadedCount === totalCount && totalCount > 0 ? "loaded" : loadedCount > 0 ? "partial" : sourceFoundCount === totalCount && totalCount > 0 ? "source-found" : "queued";
  p.loadedBundle = {
    status,
    region: App.state.context.region,
    gp: p.selectedGp || App.state.context.gp,
    site: p.gpSite || gpRow?.site || "",
    sourceManifest: manifest,
    horizonMonths: num(p.horizonMonths, 3),
    loadedAt: new Date().toLocaleString("ru-RU"),
    periods: periodRows,
  };
  p.bundleStatus = status === "loaded"
    ? `ПУНЦ загружены: ${fmtNum(periodRows.length)} мес., 1-6 ЦК`
    : status === "source-found"
      ? "Официальные файлы ПУНЦ найдены; требуется шаблон разбора"
    : status === "partial"
      ? `ПУНЦ частично загружены: ${fmtNum(loadedCount)}/${fmtNum(totalCount)} файлов`
      : "ПУНЦ поставлены в очередь: нужен доступ к сайту ГП";
  p.searchStatus = p.bundleStatus;
  App.state.context.period = periodRows[0]?.period || App.state.context.period;
  App.state.uptime.period = App.state.context.period;
  saveState();
  return p.loadedBundle;
}

function puncDataContext(period = App.state.context.period || puncPeriod(), voltage = App.state.context.voltage){
  const data = ck4Data(period);
  const regionOk = canUseLoadedPunc(period);
  const importRegionMatches = cleanSupplierName(data.region) === cleanSupplierName(App.state.context.region)
    && cleanSupplierName(data.gp) === cleanSupplierName(App.state.punc.selectedGp || App.state.context.gp);
  const importedLoaded = data.status === "loaded" && data.source === "official-import" && importRegionMatches;
  const localLoaded = data.status === "loaded" && data.source !== "official-import" && regionOk;
  const canUseData = localLoaded || importedLoaded;
  const sourceEnergyRows = canUseData ? data.energy || [] : [];
  const sourceCapacityRows = canUseData ? data.capacity || [] : [];
  const sourceSummary = canUseData ? data.summary || {} : {};
  const energyRows = sourceEnergyRows.filter((row) => row.voltage_code === voltage);
  const capacityRow = sourceCapacityRows.find((row) => row.voltage_code === voltage) || null;
  const summaryVoltage = sourceSummary?.voltage_summary?.[voltage] || {};
  const status = canUseData && energyRows.length ? "loaded" : regionOk && data.status === "loaded" && data.source === "official-import" ? "draft" : !regionOk ? "draft" : data.status || "empty";
  return {
    status,
    regionOk: regionOk || importedLoaded,
    period,
    voltage,
    energyRows,
    capacityRow,
    summary: sourceSummary,
    sourceUrl: sourceSummary?.source_url || "",
    sourceFile: sourceSummary?.source_file || "",
    finalEnergyAvgRubMwh: num(summaryVoltage.final_energy_avg_rub_mwh_no_vat, mean(energyRows.map((row) => num(row.final_energy_rate_rub_mwh_no_vat)))),
    svntsemAvgRubMwh: mean(energyRows.map((row) => num(row.svntsem_rub_mwh_no_vat))),
    transmissionAvgRubMwh: mean(energyRows.map((row) => num(row.transmission_energy_rate_rub_mwh_no_vat))),
    salesMarkupAvgRubMwh: mean(energyRows.map((row) => num(row.sales_markup_rub_mwh_no_vat))),
    infraAvgRubMwh: mean(energyRows.map((row) => num(row.infrastructure_payments_rub_mwh_no_vat))),
    purchasedCapacityRubMwMonth: num(capacityRow?.purchased_capacity_rate_rub_mw_month_no_vat),
    networkCapacityRubMwMonth: num(capacityRow?.network_maintenance_rate_rub_mw_month_no_vat),
  };
}

function pricingBasis(period = App.state.context.period || puncPeriod(), voltage = App.state.context.voltage){
  const punc = puncDataContext(period, voltage);
  const rates = networkRates(selectedNetworkRow(period), voltage);
  if(punc.status === "loaded"){
    return {
      source: "ПУНЦ ГП",
      status: "loaded",
      punc,
      rates,
      energyRubMwh: punc.svntsemAvgRubMwh,
      lossesRubMwh: punc.transmissionAvgRubMwh || rates.lossesRubMwh,
      markupRubMwh: punc.salesMarkupAvgRubMwh || currentMarkupRubKwh(period) * 1000,
      infrastructureRubMwh: punc.infraAvgRubMwh || num(App.state.categories.infrastructureRubMwh),
      powerRubMwMonth: punc.purchasedCapacityRubMwMonth || num(App.state.categories.powerRubMwMonth),
      networkPowerRubMwMonth: punc.networkCapacityRubMwMonth || rates.maintenanceRubMwMonth,
      singleRubKwh: rates.singleRubKwh,
      note: "используются опубликованные почасовые компоненты ПУНЦ выбранного ГП",
    };
  }
  return {
    source: "тарифный модуль",
    status: punc.status,
    punc,
    rates,
    energyRubMwh: num(App.state.categories.energyRubMwh),
    lossesRubMwh: rates.lossesRubMwh,
    markupRubMwh: currentMarkupRubKwh(period) * 1000,
    infrastructureRubMwh: num(App.state.categories.infrastructureRubMwh),
    powerRubMwMonth: num(App.state.categories.powerRubMwMonth),
    networkPowerRubMwMonth: rates.maintenanceRubMwMonth,
    singleRubKwh: rates.singleRubKwh,
    note: "ПУНЦ для выбранного региона/периода не загружен; применены котловые тарифы и сбытовая надбавка",
  };
}

function energyDataContext(period = App.state.context.period || puncPeriod(), voltage = App.state.context.voltage){
  const basis = pricingBasis(period, voltage);
  return {
    region: App.state.context.region,
    gp: App.state.punc.selectedGp || App.state.context.gp,
    period,
    tariffPeriodStart: tariffPeriodStart(period),
    networkRows: selectedNetworkRows(),
    networkRow: selectedNetworkRow(period),
    salesRows: selectedSalesRows(),
    salesRow: selectedSalesRow(period),
    gasRows: selectedGasRows(),
    gasRow: selectedGasRow(),
    gasRub1000: currentGasRub1000(period),
    basis,
  };
}

function puncSearchQuery(){
  return puncSearchQueryFor(puncPeriod(), App.state.punc.priceCategory);
}

function puncSearchUrl(){
  return puncSearchUrlFor(puncPeriod(), App.state.punc.priceCategory);
}

function puncAvailability(){
  const p = App.state.punc;
  const period = puncPeriod();
  const region = App.state.context.region;
  const gpRows = gpRowsForRegion(region);
  const gp = p.selectedGp || App.state.context.gp;
  const zone = priceZoneForRegion(region, gp);
  const plan = planHoursForMonth(num(p.month), region, gp);
  const peak = peakHoursForPeriod(period, region, gp);
  const punc = puncDataContext(period, App.state.context.voltage);
  const bundle = p.loadedBundle;
  const bundleMatches = bundle?.region === region && cleanSupplierName(bundle.gp) === cleanSupplierName(p.selectedGp || App.state.context.gp) && (bundle.periods || []).some((row) => row.period === period);
  const network = selectedNetworkRows();
  const sales = selectedSalesRows();
  const puncStatus = bundleMatches ? bundle.status : punc.status === "loaded" ? "loaded" : CK4_PERIODS.includes(period) ? punc.status || "draft" : "draft";
  const puncDetail = bundleMatches
    ? puncStatus === "loaded" ? "данные доступны другим модулям" : puncStatus === "source-found" ? "официальные файлы найдены" : puncStatus === "uploaded" ? "файл загружен вручную" : puncStatus === "queued" ? "ожидает официальный файл или ручную загрузку" : "пакет загружен частично"
    : punc.status === "loaded" ? "данные доступны другим модулям" : "нужен импорт/поиск на сайте ГП";
  return [
    { title: "ГП региона", status: gpRows.length ? "loaded" : "error", value: fmtNum(gpRows.length), detail: gpRows.length ? "автофильтр по региону" : "нет строк в локальных данных" },
    { title: "Пиковые часы", status: peak.status === "loaded" ? "loaded" : peak.status, value: fmtNum(plan.length), detail: peak.kind === "fact" ? `факт АТС ${periodLabel(period)}` : plan.length ? `план СО ${priceZoneLabel(zone)} · ${num(p.month)}.${num(p.year)}` : "нет календаря СО" },
    { title: "ПУНЦ", status: puncStatus, value: statusLabel(puncStatus), detail: puncDetail },
    { title: "Тарифы и надбавки", status: network.length && sales.length ? "loaded" : "draft", value: `${fmtNum(network.length)}/${fmtNum(sales.length)}`, detail: "котловые тарифы / сбытовые надбавки" },
  ];
}

function statusLabel(status){
  return { loaded: "есть", loading: "загрузка", error: "ошибка", draft: "draft", empty: "нет", plan: "план", queued: "очередь", partial: "частично", "partial-loaded": "частично", "source-found": "источник", uploaded: "файл" }[status] || status || "draft";
}

function availabilityCard(item){
  const tone = item.status === "loaded" ? "green" : item.status === "error" ? "red" : item.status === "plan" || item.status === "source-found" || item.status === "uploaded" ? "blue" : "amber";
  return `<div class="status-card ${tone}">
    <div><span>${esc(item.title)}</span>${statusBadgeText(item.status)}</div>
    <strong>${esc(item.value)}</strong>
    <small>${esc(item.detail)}</small>
  </div>`;
}

function parseDataRows(text){
  const src = String(text || "").trim();
  if(!src) return [];
  if(src.startsWith("{") || src.startsWith("[")){
    const data = JSON.parse(src);
    if(Array.isArray(data)) return data;
    if(Array.isArray(data.rows)) return data.rows;
    if(Array.isArray(data.data)) return data.data;
    if(Array.isArray(data.records)) return data.records;
    return [data];
  }
  return csvParse(src);
}

function isExcelFile(file){
  return /\.(xlsx|xlsm|xlsb|xls)$/i.test(file?.name || "");
}

function ensureXlsxLibrary(){
  if(window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-xlsx-loader]");
    if(existing){
      existing.addEventListener("load", () => resolve(window.XLSX), { once: true });
      existing.addEventListener("error", () => reject(new Error("Не удалось загрузить Excel-парсер")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.async = true;
    script.dataset.xlsxLoader = "true";
    script.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error("Excel-парсер не найден"));
    script.onerror = () => reject(new Error("Не удалось загрузить Excel-парсер"));
    document.head.appendChild(script);
  });
}

function headerScore(row){
  const dateTokens = ["date", "datetime", "period", "timestamp", "дата", "датавремя", "период", "время"];
  const hourTokens = ["hour", "час", "чассуток", "часокончания"];
  const energyTokens = ["kwh", "mwh", "квтч", "мвтч", "объемквтч", "энергияквтч", "потреблениеквтч", "объеммвтч", "энергиямвтч"];
  const powerTokens = ["powerkw", "loadkw", "kw", "квт", "мощностьквт", "нагрузкаквт"];
  return (row || []).reduce((score, cell) => {
    const key = normalizeMetricKey(cell);
    if(!key) return score;
    if(dateTokens.some((token) => keyLooksLike(key, token))) score += 2;
    if(hourTokens.some((token) => keyLooksLike(key, token))) score += 2;
    if(energyTokens.some((token) => keyLooksLike(key, token))) score += 3;
    if(powerTokens.some((token) => keyLooksLike(key, token))) score += 3;
    return score;
  }, 0);
}

function excelRowsToObjects(aoa){
  const rows = (aoa || []).filter((row) => Array.isArray(row) && row.some((cell) => String(cell ?? "").trim() !== ""));
  if(!rows.length) return [];
  let headerIndex = 0;
  let bestScore = -1;
  rows.slice(0, 30).forEach((row, index) => {
    const score = headerScore(row);
    if(score > bestScore){
      bestScore = score;
      headerIndex = index;
    }
  });
  const headers = rows[headerIndex].map((cell, index) => String(cell || `column_${index + 1}`).trim() || `column_${index + 1}`);
  return rows.slice(headerIndex + 1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

async function parseExcelRows(file){
  const XLSX = await ensureXlsxLibrary();
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true, dateNF: "yyyy-mm-dd hh:mm:ss" });
  const sheetName = workbook.SheetNames.find((name) => {
    const aoa = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: "", raw: false, dateNF: "yyyy-mm-dd hh:mm:ss" });
    return excelRowsToObjects(aoa).length > 0;
  }) || workbook.SheetNames[0];
  const aoa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "", raw: false, dateNF: "yyyy-mm-dd hh:mm:ss" });
  return excelRowsToObjects(aoa);
}

async function parseFileRows(file){
  if(isExcelFile(file)) return parseExcelRows(file);
  return parseDataRows(await file.text());
}

function normalizeMetricKey(key){
  return String(key || "").toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9]/g, "");
}

function keyLooksLike(normalizedKey, token){
  const t = normalizeMetricKey(token);
  if(normalizedKey === t) return true;
  if(t.length >= 3 && /[a-z]/.test(t) && normalizedKey.includes(t)) return true;
  if(t.length >= 4 && /[а-я]/.test(t) && normalizedKey.includes(t)) return true;
  return false;
}

function pickNumber(row, tokens){
  for(const [key, value] of Object.entries(row || {})){
    const normalized = normalizeMetricKey(key);
    if(tokens.some((token) => keyLooksLike(normalized, token))){
      const parsed = num(value, NaN);
      if(Number.isFinite(parsed)) return parsed;
    }
  }
  return NaN;
}

function pickText(row, tokens){
  for(const [key, value] of Object.entries(row || {})){
    const normalized = normalizeMetricKey(key);
    if(tokens.some((token) => keyLooksLike(normalized, token))) return String(value || "");
  }
  return "";
}

function parseIntervalDate(row){
  const text = pickText(row, ["date", "datetime", "period", "timestamp", "дата", "датавремя", "период", "время"]);
  if(!text) return null;
  const iso = text.match(/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if(iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  const ru = text.match(/(\d{1,2})[./-](\d{1,2})[./-](20\d{2})/);
  if(ru) return new Date(Date.UTC(Number(ru[3]), Number(ru[2]) - 1, Number(ru[1])));
  return null;
}

function parseIntervalHour(row){
  const explicit = pickNumber(row, ["hour", "час", "чассуток", "часокончания"]);
  if(Number.isFinite(explicit)){
    if(explicit >= 1 && explicit <= 24) return explicit - 1;
    if(explicit >= 0 && explicit <= 23) return explicit;
  }
  const text = pickText(row, ["datetime", "timestamp", "датавремя", "время", "period", "период"]);
  const match = text.match(/\b(\d{1,2}):\d{2}/);
  if(match){
    const hour = Number(match[1]);
    return hour >= 0 && hour <= 23 ? hour : null;
  }
  return null;
}

function summarizeIntegralRows(rows){
  const totals = rows.map((row) => {
    const kwh = pickNumber(row, ["kwh", "квтч", "объемквтч", "потреблениеквтч", "энергияквтч"]);
    if(Number.isFinite(kwh)) return kwh;
    const mwh = pickNumber(row, ["mwh", "мвтч", "объеммвтч", "потреблениемвтч", "энергиямвтч"]);
    return Number.isFinite(mwh) ? mwh * 1000 : 0;
  });
  return totals.reduce((a, b) => a + b, 0);
}

function summarizeIntervalRows(rows){
  const [year, month] = String(App.state.context.period || puncPeriod()).split("-").map(Number);
  const plan = planHourIndexes(Number.isFinite(month) ? month : App.state.punc.month);
  const expectedPoints = monthDays(Number.isFinite(year) ? year : 2026, Number.isFinite(month) ? month : App.state.punc.month) * 24;
  const values = [];
  const peakValues = [];
  const pchpnValues = [];
  let totalKwh = 0;
  rows.forEach((row) => {
    const energyKwh = pickNumber(row, ["kwh", "квтч", "объемквтч", "потреблениеквтч", "энергияквтч"]);
    const energyMwh = pickNumber(row, ["mwh", "мвтч", "объеммвтч", "потреблениемвтч", "энергиямвтч"]);
    const powerKw = pickNumber(row, ["powerkw", "loadkw", "kw", "квт", "мощностьквт", "нагрузкаквт"]);
    const kwh = Number.isFinite(energyKwh) ? energyKwh : Number.isFinite(energyMwh) ? energyMwh * 1000 : Number.isFinite(powerKw) ? powerKw : NaN;
    const kw = Number.isFinite(powerKw) ? powerKw : Number.isFinite(kwh) ? kwh : NaN;
    if(!Number.isFinite(kw)) return;
    values.push(kw);
    if(Number.isFinite(kwh)) totalKwh += kwh;
    const date = parseIntervalDate(row);
    const hour = parseIntervalHour(row);
    if(date && isWorkingDay(date)) peakValues.push(kw);
    if(date && Number.isInteger(hour) && isWorkingDay(date) && plan.includes(hour)) pchpnValues.push(kw);
  });
  const sum = values.reduce((a, b) => a + b, 0);
  const peak = values.length ? Math.max(...values) : 0;
  const workdayPeak = peakValues.length ? Math.max(...peakValues) : peak;
  const pchpn = pchpnValues.length ? pchpnValues.reduce((a, b) => a + b, 0) / pchpnValues.length : App.state.context.pchpnMw * 1000;
  const coverage = expectedPoints ? Math.min(100, rows.length / expectedPoints * 100) : 0;
  return {
    kwh: totalKwh || sum,
    points: rows.length,
    peakKw: peak,
    avgKw: values.length ? sum / values.length : 0,
    workdayPeakKw: workdayPeak,
    pchpnKw: pchpn,
    coveragePct: coverage,
    loadFactorPct: peak ? (sum / values.length) / peak * 100 : 0,
  };
}

function quoteEquipmentType(row){
  const text = cleanSupplierName([
    pickText(row, ["тип", "оборудование", "equipment", "вид", "категория"]),
    pickText(row, ["модель", "model", "описание", "description", "name", "наименование"]),
  ].join(" "));
  if(/гпу|газопорш|газов|genset|gasengine/.test(text)) return "gas";
  if(/сэс|фэс|солнеч|pv|solar/.test(text)) return "pv";
  if(/дгу|дизел|diesel/.test(text)) return "diesel";
  if(/накоп|снэ|аккум|battery|bess/.test(text)) return "bess";
  if(/тп|техприс|подстанц|connection|grid/.test(text)) return "grid";
  if(/ems|асу|диспетчер|scada/.test(text)) return "ems";
  return "other";
}

function quoteTypeLabel(type){
  return { gas: "ГПУ", pv: "СЭС", diesel: "ДГУ", bess: "накопитель", grid: "ТП/сеть", ems: "EMS/АСУ", other: "прочее" }[type] || "прочее";
}

function normalizeQuoteItem(row){
  const qty = Math.max(1, num(pickNumber(row, ["qty", "quantity", "количество", "шт"]), 1));
  const powerKw = pickNumber(row, ["powerkw", "мощностьквт", "квт", "kw"]);
  const capacityKwh = pickNumber(row, ["capacitykwh", "емкостьквтч", "энергоемкость", "квтч", "kwh"]);
  const capexRub = pickNumber(row, ["capexrub", "capex", "стоимостьруб", "стоимость", "ценаитого", "цена", "суммаруб", "сумма", "totalrub", "total", "budget", "капекс"]);
  const unitRubKw = pickNumber(row, ["rubkw", "рубквт", "цена1квт", "unitrubkw"]);
  const unitRubKwh = pickNumber(row, ["rubkwh", "рубквтч", "цена1квтч", "unitrubkwh"]);
  const opexRubYear = pickNumber(row, ["opexrubyear", "тоиррубгод", "сервисрубгод", "opex", "service"]);
  const type = quoteEquipmentType(row);
  const computedCapex = Number.isFinite(capexRub) && capexRub > 0
    ? capexRub
    : Number.isFinite(unitRubKw) && Number.isFinite(powerKw) ? unitRubKw * powerKw * qty
      : Number.isFinite(unitRubKwh) && Number.isFinite(capacityKwh) ? unitRubKwh * capacityKwh * qty
        : 0;
  return {
    type,
    supplier: pickText(row, ["supplier", "поставщик", "vendor", "контрагент"]) || "поставщик не указан",
    model: pickText(row, ["model", "модель", "name", "наименование", "описание"]) || quoteTypeLabel(type),
    qty,
    powerKw: Number.isFinite(powerKw) ? powerKw * qty : 0,
    capacityKwh: Number.isFinite(capacityKwh) ? capacityKwh * qty : 0,
    capexRub: computedCapex,
    opexRubYear: Number.isFinite(opexRubYear) ? opexRubYear : 0,
    gasConsumptionM3Mwh: pickNumber(row, ["gasconsumption", "расходгазам3мвтч", "м3мвтч", "удельныйрасход"]),
    availabilityPct: pickNumber(row, ["availability", "доступность", "готовность", "kиум", "киум"]),
  };
}

function generationQuoteTotals(items = App.state.generation.quoteItems){
  const clean = (items || []).filter((item) => num(item.capexRub) > 0 || num(item.powerKw) > 0 || num(item.opexRubYear) > 0);
  const total = (type, key) => clean.filter((item) => item.type === type).reduce((sum, item) => sum + num(item[key]), 0);
  return {
    items: clean,
    capexRub: clean.reduce((sum, item) => sum + num(item.capexRub), 0),
    opexRubYear: clean.reduce((sum, item) => sum + num(item.opexRubYear), 0),
    gasPowerKw: total("gas", "powerKw"),
    pvPowerKw: total("pv", "powerKw"),
    dieselPowerKw: total("diesel", "powerKw"),
    bessPowerKw: total("bess", "powerKw"),
    bessCapacityKwh: total("bess", "capacityKwh"),
  };
}

function applyQuoteTechnicalDefaults(items){
  const g = App.state.generation;
  const totals = generationQuoteTotals(items);
  if(totals.gasPowerKw > 0) g.gasEngineKw = rounded(totals.gasPowerKw, 0);
  if(totals.pvPowerKw > 0) g.pvKwp = rounded(totals.pvPowerKw, 0);
  if(totals.dieselPowerKw > 0) g.dieselKw = rounded(totals.dieselPowerKw, 0);
  if(totals.bessPowerKw > 0 || totals.bessCapacityKwh > 0){
    g.bessEnabled = "yes";
    if(totals.bessPowerKw > 0) g.bessPowerKw = rounded(totals.bessPowerKw, 0);
    if(totals.bessCapacityKwh > 0) g.bessCapacityKwh = rounded(totals.bessCapacityKwh, 0);
  }
  const gasItems = items.filter((item) => item.type === "gas");
  const weightedGas = gasItems.filter((item) => Number.isFinite(num(item.gasConsumptionM3Mwh, NaN)) && num(item.powerKw) > 0);
  const gasPower = weightedGas.reduce((sum, item) => sum + num(item.powerKw), 0);
  if(gasPower > 0) g.gasConsumptionM3Mwh = rounded(weightedGas.reduce((sum, item) => sum + num(item.gasConsumptionM3Mwh) * num(item.powerKw), 0) / gasPower, 1);
  const availability = gasItems.map((item) => num(item.availabilityPct, NaN)).filter(Number.isFinite);
  if(availability.length) g.gasAvailabilityPct = rounded(mean(availability), 1);
}

async function handleFileUpload(kind, file){
  const cfg = App.state.categories;
  try {
    const rows = await parseFileRows(file);
    if(kind === "punc-source"){
      const period = puncPeriod();
      const peak = peakHoursForPeriod(period);
      App.state.punc.loadedBundle = {
        status: "uploaded",
        region: App.state.context.region,
        gp: App.state.punc.selectedGp || App.state.context.gp,
        site: App.state.punc.gpSite || "",
        horizonMonths: 1,
        loadedAt: new Date().toLocaleString("ru-RU"),
        periods: [{
          period,
          gp: App.state.punc.selectedGp || App.state.context.gp,
          site: App.state.punc.gpSite || "",
          localSupported: false,
          categories: PRICE_CATEGORIES.map((category) => ({ category, status: "uploaded", source: file.name, mode: "manual-file" })),
          peakHours: peak.hours,
          peakDaily: peak.daily,
          peakKind: peak.kind,
          peakStatus: peak.status,
          peakSource: peak.source,
          source: `ручная загрузка файла ПУНЦ: ${file.name}; строк распознано: ${fmtNum(rows.length)}`,
        }],
      };
      App.state.punc.bundleStatus = `Файл ПУНЦ загружен вручную: ${file.name}`;
      App.state.punc.searchStatus = "файл загружен вручную";
      App.state.context.period = period;
      App.state.uptime.period = period;
    }
    if(kind === "integral-metering"){
      const kwh = summarizeIntegralRows(rows);
      cfg.integralFileName = file.name;
      cfg.integralKwh = kwh;
      if(kwh > 0) App.state.context.monthlyMwh = kwh / 1000;
      cfg.meteringStatus = `Интегральные данные: ${file.name}, ${fmtNum(kwh, 0)} кВт·ч`;
    }
    if(kind === "interval-metering"){
      const summary = summarizeIntervalRows(rows);
      cfg.intervalFileName = file.name;
      cfg.intervalKwh = summary.kwh;
      cfg.intervalPoints = summary.points;
      cfg.intervalPeakKw = summary.peakKw;
      cfg.intervalAvgKw = summary.avgKw;
      cfg.intervalWorkdayPeakKw = summary.workdayPeakKw;
      cfg.intervalPchpnKw = summary.pchpnKw;
      cfg.intervalCoveragePct = summary.coveragePct;
      cfg.loadFactorPct = summary.loadFactorPct;
      if(summary.kwh > 0) App.state.context.monthlyMwh = rounded(summary.kwh / 1000, 3);
      if(summary.workdayPeakKw > 0) App.state.context.poplMw = rounded(summary.workdayPeakKw / 1000, 3);
      if(summary.pchpnKw > 0) App.state.context.pchpnMw = rounded(summary.pchpnKw / 1000, 3);
      cfg.meteringStatus = `Интервальные данные: ${file.name}, ${fmtNum(summary.points)} точек`;
    }
    if(kind === "equipment-quotes"){
      const items = rows.map(normalizeQuoteItem).filter((item) => item.capexRub > 0 || item.powerKw > 0 || item.opexRubYear > 0);
      App.state.generation.quoteFileName = file.name;
      App.state.generation.quoteItems = items;
      App.state.generation.capexSource = items.length ? "quotes" : "manual";
      App.state.generation.quoteStatus = items.length
        ? `КП загружены: ${file.name}, ${fmtNum(items.length)} поз.`
        : `КП загружены, но позиции не распознаны: ${file.name}`;
      if(items.length) applyQuoteTechnicalDefaults(items);
    }
  } catch (err) {
    if(kind === "equipment-quotes"){
      App.state.generation.quoteStatus = `Ошибка загрузки КП: ${err.message}`;
    } else if(kind === "punc-source"){
      App.state.punc.bundleStatus = `Ошибка загрузки файла ПУНЦ: ${err.message}`;
    } else {
      cfg.meteringStatus = `Ошибка загрузки: ${err.message}`;
    }
  }
  saveState();
  render(false);
}

async function loadCk4Period(period){
  const target = CK4_PERIODS.includes(period) ? period : "2026-04";
  const cached = App.data.ck4[target];
  if(!canUseLoadedPunc(target)){
    return cached || { status: "empty", energy: [], capacity: [], summary: {} };
  }
  if(cached?.status === "loaded" && cached.source !== "official-import") return cached;
  if(cached?.status === "loading") return cached;
  App.data.ck4[target] = { status: "loading" };
  const base = `../krasny-yar-energo/data/svntsm/${target}/processed`;
  try {
    const [energyRes, capacityRes, summaryRes] = await Promise.all([
      fetch(`${base}/4ck_${target}_670kw-10mw_energy_hourly_by_voltage.csv`),
      fetch(`${base}/4ck_${target}_670kw-10mw_capacity_rates_by_voltage.csv`),
      fetch(`${base}/4ck_${target}_670kw-10mw_summary.json`),
    ]);
    if(!energyRes.ok || !capacityRes.ok) throw new Error(`4 ЦК ${target}: данные не найдены`);
    const [energyText, capacityText] = await Promise.all([energyRes.text(), capacityRes.text()]);
    const summary = summaryRes.ok ? await summaryRes.json() : {};
    App.data.ck4[target] = {
      status: "loaded",
      source: "local-cache",
      region: "Красноярский край",
      gp: "ПАО Красноярскэнергосбыт",
      energy: csvParse(energyText),
      capacity: csvParse(capacityText),
      summary,
    };
  } catch (err) {
    App.data.ck4[target] = { status: "error", error: err.message };
  }
  return App.data.ck4[target];
}

function ck4Data(period){
  return App.data.ck4[period] || { status: "empty", energy: [], capacity: [], summary: {} };
}

function statusBadgeText(status){
  const map = {
    active: ["green", "active"],
    confirmed: ["green", "confirmed"],
    draft: ["amber", "draft"],
    unconfirmed: ["amber", "unconfirmed"],
    partial: ["amber", "partial"],
    "partial-loaded": ["amber", "partial"],
    plan: ["blue", "plan"],
    queued: ["amber", "queued"],
    "source-found": ["blue", "source"],
    uploaded: ["blue", "file"],
    "passport-preferred": ["blue", "passport"],
    "address-preferred": ["blue", "адрес"],
    loaded: ["green", "loaded"],
    error: ["red", "error"],
  };
  const [tone, label] = map[status] || ["amber", status || "draft"];
  return `<span class="badge ${tone}">${esc(label)}</span>`;
}

function moduleStatusBadge(status){
  if(status === "data") return `<span class="badge blue">данные</span>`;
  if(status === "calc") return `<span class="badge green">расчет</span>`;
  return `<span class="badge amber">draft</span>`;
}

function shell(body){
  const current = MODULES.find((m) => m.id === App.state.view) || MODULES[0];
  const st = sourceStatus();
  const nav = MODULES.map((m) => `<button class="${App.state.view === m.id ? "active" : ""}" data-view="${m.id}">${icon(m.icon)}<span>${esc(m.short)}</span></button>`).join("");
  document.getElementById("app").innerHTML = `<div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${icon("bolt")}</div>
        <div><b>Красный Яр<br>Энерго App</b><span>Energy workspace</span></div>
      </div>
      <nav class="nav">${nav}</nav>
      <div class="sidebar-foot">
        <div><span class="status-dot"></span>${st.ok ? "локальные данные подключены" : "нет data.js"}</div>
        <div style="margin-top:8px">Тарифы: ${fmtNum(st.network)} · Надбавки: ${fmtNum(st.sales)} · Газ: ${fmtNum(st.gas)}</div>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="title-line">
          <button class="menu-button" id="menuButton" aria-label="Меню">${icon("menu")}</button>
          <h1>${esc(current.title)}</h1>
        </div>
        <div class="top-actions">
          <span class="context-pill">${esc(App.state.context.region)}</span>
          <span class="context-pill">${esc(App.state.context.period)}</span>
          <span class="source-pill"><span class="status-dot"></span>Draft 1</span>
          <span class="user-pill"><span class="user-avatar">КЯ</span> workspace</span>
        </div>
      </header>
      <section class="content">${body}</section>
    </main>
  </div>`;
  document.querySelectorAll("[data-view]").forEach((btn) => btn.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    setView(btn.dataset.view);
  }));
  document.getElementById("menuButton")?.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  wireInputs();
}

function scheduleDeferredInputRender(path, value){
  window.clearTimeout(deferredInputRenderTimer);
  deferredInputRenderTimer = window.setTimeout(() => {
    const activeEl = document.activeElement;
    if(activeEl?.dataset?.noLive === "true" || activeEl?.type === "number"){
      scheduleDeferredInputRender(path, value);
      return;
    }
    if(path === "uptime.period" || path === "context.period"){
      loadCk4Period(value).then(() => render(false)).catch(() => render(false));
    } else {
      render(false);
    }
  }, 800);
}

function wireInputs(){
  document.querySelectorAll("[data-path]").forEach((el) => {
    const commitValue = (renderMode = "now") => {
      if(isRendering) return;
      const parser = el.dataset.parser;
      const value = parser === "number" || parser === "Number" ? num(el.value) : el.value;
      const keys = el.dataset.path.split(".");
      let cursor = App.state;
      while(keys.length > 1) cursor = cursor[keys.shift()];
      cursor[keys[0]] = value;
      if(el.dataset.path === "context.region"){
        applyRegionSelection(value);
        saveState();
        const period = App.state.context.period || puncPeriod();
        if(canUseLoadedPunc(period)){
          loadCk4Period(period).then(() => render()).catch(() => render());
        } else {
          render();
        }
        return;
      }
      if(el.dataset.path === "context.gp"){
        App.state.punc.selectedGp = value;
        App.state.punc.priceZone = String(priceZoneForRegion(App.state.context.region, value));
      }
      if(el.dataset.path === "punc.selectedGp"){
        App.state.context.gp = value;
        App.state.punc.priceZone = String(priceZoneForRegion(App.state.context.region, value));
        const site = defaultGpSite(value, App.state.context.region);
        if(site) App.state.punc.gpSite = site;
        saveState();
        loadPuncBundleForSelectedGp().then(() => render()).catch(() => render());
        return;
      }
      if(el.dataset.path === "punc.horizonMonths"){
        saveState();
        loadPuncBundleForSelectedGp().then(() => render()).catch(() => render());
        return;
      }
      saveState();
      const needsPeriodReload = el.dataset.path === "uptime.period" || el.dataset.path === "context.period";
      if(renderMode === "defer"){
        if(el.type === "number" || el.dataset.noLive === "true"){
          return;
        }
        scheduleDeferredInputRender(el.dataset.path, value);
        return;
      }
      window.clearTimeout(deferredInputRenderTimer);
      if(el.dataset.noLive === "true"){
        scheduleDeferredInputRender(el.dataset.path, value);
        return;
      }
      if(needsPeriodReload){
        loadCk4Period(value).then(() => render()).catch(() => render());
      } else {
        render(false);
      }
    };
    if(el.tagName === "SELECT"){
      el.addEventListener("change", () => commitValue("now"));
    } else {
      el.addEventListener("input", () => commitValue("defer"));
      el.addEventListener("change", () => commitValue("now"));
      if(el.dataset.noLive === "true"){
        el.addEventListener("blur", () => commitValue("now"));
      }
    }
  });
  document.querySelectorAll("[data-click]").forEach((el) => {
    el.addEventListener("click", () => handleAction(el.dataset.click, el.dataset.value));
  });
  document.querySelectorAll("[data-file]").forEach((el) => {
    el.addEventListener("change", () => {
      const file = el.files?.[0];
      if(file) handleFileUpload(el.dataset.file, file);
    });
  });
}

function render(resetShell = true){
  if(isRendering) return;
  isRendering = true;
  const view = App.state.view || "home";
  const body = {
    home: renderHome,
    info: renderInfo,
    punc: renderPunc,
    categories: renderCategories,
    uptime4: renderUptime,
    orem: renderOrem,
    gas: renderGasTariffs,
    generation: renderGeneration,
  }[view]?.() || renderHome();
  try {
    if(resetShell) shell(body);
    else {
      const content = document.querySelector(".content");
      if(content) {
        content.innerHTML = body;
        wireInputs();
      } else {
        shell(body);
      }
    }
  } finally {
    isRendering = false;
  }
}

function contextControls(){
  const regions = getRegions();
  const ctx = App.state.context;
  const zone = priceZoneForRegion(ctx.region, ctx.gp);
  return `<div class="panel">
    <div class="panel-head"><h3>Единый контекст расчета</h3><span>используется всеми механизмами</span></div>
    <div class="panel-body">
      <div class="form-grid">
        <div class="field"><label>Регион</label><select ${updateInput("context.region")}>${regions.map((r) => `<option ${r === ctx.region ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
        <div class="field"><label>ГП / зона</label><input value="${esc(ctx.gp)}" ${updateInput("context.gp")}></div>
        <div class="field"><label>Ценовая зона</label><input value="${esc(priceZoneLabel(zone))}" disabled></div>
        <div class="field"><label>Период</label><input value="${esc(ctx.period)}" ${updateInput("context.period")}></div>
        <div class="field"><label>Напряжение</label><select ${updateInput("context.voltage")}>
          ${["VN","SN-I","SN-II","NN"].map((v) => `<option value="${v}" ${v === ctx.voltage ? "selected" : ""}>${voltageLabel(v)}</option>`).join("")}
        </select></div>
        <div class="field"><label>Объем, МВт·ч/мес</label><input type="number" value="${esc(ctx.monthlyMwh)}" ${updateInput("context.monthlyMwh", Number)}></div>
        <div class="field"><label>Мощность, кВт</label><input type="text" inputmode="decimal" value="${esc(ctx.connectedKw)}" ${updateInput("context.connectedKw", Number)} data-no-live="true"></div>
      </div>
    </div>
  </div>`;
}

function homeRegionPanel(){
  const ctx = App.state.context;
  const query = String(App.state.home.regionQuery || "").trim();
  const regions = getRegions();
  const filtered = query
    ? regions.filter((region) => regionMatchesQuery(region, query)).slice(0, 80)
    : regions;
  const options = filtered.includes(ctx.region) ? filtered : [ctx.region, ...filtered];
  const status = regionalDataStatus(ctx.region);
  const bundle = App.state.punc.loadedBundle;
  const puncReady = bundle?.region === ctx.region && bundle?.status;
  return `<div class="panel">
    <div class="panel-head"><h3>Выбор региона для работы</h3><span>${esc(App.state.home.dataStatus || "выберите субъект РФ")}</span></div>
    <div class="panel-body">
      <div class="form-grid one">
        <div class="field"><label>Поиск субъекта РФ</label><input placeholder="начните вводить регион" value="${esc(App.state.home.regionQuery || "")}" ${updateInput("home.regionQuery")}></div>
        <div class="field"><label>Субъект РФ</label><select ${updateInput("context.region")}>${options.map((r) => `<option ${r === ctx.region ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
        <div class="button-row"><button class="btn" type="button" data-click="prepare-region">${icon("database")} Подготовить регион</button><button class="btn secondary" type="button" data-click="go-punc">${icon("clock")} Перейти к ПУНЦ</button></div>
      </div>
      <div class="status-grid region-status-grid" style="margin-top:14px">
        ${availabilityCard({ title: "Котловые сети", status: status.network.length ? "loaded" : "draft", value: fmtNum(status.network.length), detail: tariffPeriodStart(ctx.period) })}
        ${availabilityCard({ title: "ГП / надбавки", status: status.sales.length && status.gp.length ? "loaded" : "draft", value: fmtNum(status.gp.length), detail: `${fmtNum(status.sales.length)} строк надбавок` })}
        ${availabilityCard({ title: "Газ / ГРО", status: status.gas.length && status.gro.length ? "loaded" : "draft", value: fmtNum(status.gro.length), detail: `${fmtNum(status.gas.length)} строк газа` })}
        ${availabilityCard({ title: "ПУНЦ", status: puncReady || "draft", value: puncReady ? statusLabel(bundle.status) : "нет", detail: bundle?.bundleStatus || App.state.punc.bundleStatus || "после выбора ГП" })}
      </div>
      <div class="region-data-grid" style="margin-top:14px">
        <div>${homeGpMiniTable(status.gp.slice(0, 5))}</div>
        <div>${homeGroMiniTable(status.gro.slice(0, 5))}</div>
      </div>
    </div>
  </div>`;
}

function homeGpMiniTable(rows){
  if(!rows.length) return `<div class="empty">ГП по региону пока не найдены</div>`;
  return `<div class="mini-table"><h4>ГП субъекта</h4><div class="table-wrap"><table><thead><tr><th>ГП</th><th>Сайт</th></tr></thead><tbody>
    ${rows.map((row) => `<tr><td>${esc(row.name)}</td><td>${row.site ? `<a href="${esc(row.site)}" target="_blank">${esc(row.site.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : "уточнить"}</td></tr>`).join("")}
  </tbody></table></div></div>`;
}

function homeGroMiniTable(rows){
  if(!rows.length) return `<div class="empty">ГРО по региону пока не найдены</div>`;
  return `<div class="mini-table"><h4>Газораспределительные организации</h4><div class="table-wrap"><table><thead><tr><th>ГРО</th><th>Зона</th></tr></thead><tbody>
    ${rows.map((row) => `<tr><td>${esc(row.name)}</td><td>${esc(row.zones.slice(0, 2).join("; "))}</td></tr>`).join("")}
  </tbody></table></div></div>`;
}

function renderHome(){
  const modules = MODULES.filter((m) => m.id !== "home");
  const summary = calcSummary();
  return `<div class="hero-grid">
    <div class="panel">
      <div class="panel-head"><h2>Механизмы расчета</h2><span>единая оболочка Draft 1</span></div>
      <div class="panel-body">
        <div class="module-grid">
          ${modules.map((m) => `<button class="module-tile" data-view="${m.id}">
            <span class="module-title">${icon(m.icon)}${esc(m.title)}</span>
            <span class="module-note">${moduleIntro(m.id)}</span>
            <span class="module-foot">${moduleStatusBadge(m.status)}<span class="badge">${moduleSourceLabel(m.id)}</span></span>
          </button>`).join("")}
        </div>
      </div>
    </div>
    ${homeRegionPanel()}
  </div>
  <div class="kpi-grid">
    <div class="kpi"><small>Текущая 4 ЦК</small><strong>${fmtMln(summary.ck4Total)}</strong><span>${fmtNum(summary.ck4Rate, 2)} ₽/кВт·ч без НДС</span></div>
    <div class="kpi"><small>ОРЭМ эффект</small><strong>${fmtMln(summary.oremEffect)}</strong><span>РУЦ + сбытовая надбавка</span></div>
    <div class="kpi"><small>Генерация CAPEX</small><strong>${fmtMln(summary.dgCapex)}</strong><span>ГПУ + СЭС + контур</span></div>
    <div class="kpi"><small>Источник данных</small><strong>${fmtNum(sourceStatus().network + sourceStatus().sales + sourceStatus().gas)}</strong><span>строк тарифов и газа</span></div>
  </div>
  <div class="split" style="margin-top:14px">
    <div class="panel"><div class="panel-head"><h3>Связка данных</h3><span>Draft 1</span></div><div class="panel-body">
      <div class="chart">
        ${bar("Информационный модуль", 100, "green")}
        ${bar("ПУНЦ / часы пика", 62, "amber")}
        ${bar("ЦК 1-6", 74, "green")}
        ${bar("Аптайм 4 ЦК", 78, "green")}
        ${bar("ОРЭМ", 68, "amber")}
        ${bar("Генерация", 70, "green")}
      </div>
    </div></div>
    <div class="panel"><div class="panel-head"><h3>Исходные модули</h3><span>сохраняются без изменений</span></div><div class="panel-body">
      <div class="source-list">
        ${Object.entries(SOURCE_MODULES).slice(0, 6).map(([k, href]) => `<a href="${href}" target="_blank">${esc(k)} · ${esc(href)}</a>`).join("")}
      </div>
    </div></div>
  </div>`;
}

function moduleIntro(id){
  return {
    info: "Котловые тарифы, ФСК/ЕНЭС и сбытовые надбавки по выбранному субъекту.",
    punc: "Период, зона ГП, плановые часы СО и статус обновления рыночных данных.",
    categories: "Сравнение 1-6 ценовых категорий на общем контексте потребления.",
    uptime4: "График работы, плановые ЧПН, Pчпн и стоимость 4 ЦК.",
    orem: "РУЦ, исключение сбытовой надбавки и эффект перехода на ОРЭМ.",
    gas: "Компоненты цены газа, ГРО, полнота данных и газификация субъекта.",
    generation: "CAPEX, OPEX, когенерация, NPV и окупаемость распределенной генерации.",
  }[id] || "";
}

function moduleSourceLabel(id){
  return {
    info: "tariffs-2026",
    punc: "market-data",
    categories: "calc-6cz",
    uptime4: "ck4",
    orem: "node-price",
    gas: "gas-tariffs",
    generation: "dg-finmodel",
  }[id] || "module";
}

function bar(label, value, tone = ""){
  return `<div class="bar-row"><span>${esc(label)}</span><div class="bar-track"><div class="bar-fill ${tone}" style="width:${Math.max(0, Math.min(100, value))}%"></div></div><b>${fmtPct(value, 0)}</b></div>`;
}

function electricTariffIntegrationPanel(dataCtx, rates, markup, fskInfo){
  const basis = dataCtx.basis;
  const rows = [
    ["Котловой тариф", dataCtx.networkRow ? "подключен" : "нет строки", dataCtx.networkRow ? `${dataCtx.tariffPeriodStart} · ${voltageLabel(dataCtx.voltage)}` : "проверьте субъект/период", dataCtx.networkRow?.source_name || ""],
    ["Содержание сетей", rates.maintenanceRubMwMonth ? "используется" : "нет ставки", `${fmtNum(rates.maintenanceRubMwMonth, 2)} ₽/МВт·мес`, "Аптайм 4 ЦК, ЦК 4/6, генерация при сетевом бенчмарке"],
    ["Потери сетей", rates.lossesRubMwh ? "используется" : "нет ставки", `${fmtNum(rates.lossesRubMwh, 2)} ₽/МВт·ч`, "энергетическая часть при fallback без ПУНЦ"],
    ["Сбытовая надбавка", markup ? "подключена" : "нет строки", markup ? `${fmtNum(num(markup.sales_markup_rub_kwh_ex_vat), 5)} ₽/кВт·ч` : "проверьте ГП/группу", markup?.guaranteeing_supplier || ""],
    ["ПУНЦ", basis.punc.status === "loaded" ? "приоритет" : "fallback", basis.punc.status === "loaded" ? "почасовые компоненты ГП" : "котел + надбавка", basis.note],
    ["ФСК / ЕНЭС", "отдельный режим", `${fmtNum(fskInfo.maintenanceRubMwMonth, 2)} ₽/МВт·мес`, "не смешивается с региональным котлом"],
  ].map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td>${esc(row[2])}</td><td>${esc(row[3])}</td></tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr><th>База</th><th>Статус</th><th>Значение</th><th>Где используется</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderInfo(){
  const ctx = App.state.context;
  const network = selectedNetworkRows();
  const sales = selectedSalesRows();
  const row = selectedNetworkRow();
  const rates = networkRates(row);
  const markup = selectedSalesRow();
  const dataCtx = energyDataContext(ctx.period || puncPeriod(), ctx.voltage);
  const prices = dataCtx.basis;
  const fskInfo = fskTransmissionEquivalent({
    period: ctx.period || puncPeriod(),
    region: ctx.region,
    volumeKwh: num(ctx.monthlyMwh) * 1000,
    capacityKw: num(ctx.pchpnMw) * 1000 || num(ctx.connectedKw),
  });
  return `<div class="workspace">
    ${contextControls()}
    <div>
      <div class="kpi-grid">
        <div class="kpi"><small>Содержание сети ${voltageLabel()}</small><strong>${fmtMln(rates.maintenanceRubMwMonth)}</strong><span>руб./МВт·мес</span></div>
        <div class="kpi"><small>Потери ${voltageLabel()}</small><strong>${fmtNum(rates.lossesRubMwh, 2)}</strong><span>руб./МВт·ч</span></div>
        <div class="kpi"><small>Сбытовая надбавка</small><strong>${fmtNum(num(markup?.sales_markup_rub_kwh_ex_vat), 4)}</strong><span>руб./кВт·ч без НДС</span></div>
        <div class="kpi"><small>ФСК / ЕНЭС содержание</small><strong>${fmtMln(fskInfo.maintenanceRubMwMonth)}</strong><span>${fmtNum(fskInfo.maintenanceRubKwh, 4)} ₽/кВт·ч условно</span></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>База тарифов э/э</h3><span>${esc(ctx.region)} · ${esc(ctx.period)}</span></div><div class="panel-body">
        <div class="status-grid">
          ${availabilityCard({ title: "Котловые тарифы", status: row ? "loaded" : "draft", value: row ? dataCtx.tariffPeriodStart : "нет", detail: row?.source_name || "нет строки региона" })}
          ${availabilityCard({ title: "ФСК / ЕНЭС", status: "loaded", value: `${fmtNum(fskInfo.maintenanceRubMwMonth, 2)} ₽/МВт·мес`, detail: fskInfo.tierLabel })}
          ${availabilityCard({ title: "Сбытовая надбавка", status: markup ? "loaded" : "draft", value: markup ? `${fmtNum(num(markup.sales_markup_rub_kwh_ex_vat), 5)} ₽/кВт·ч` : "нет", detail: markup?.guaranteeing_supplier || "нет строки ГП" })}
          ${availabilityCard({ title: "ПУНЦ", status: prices.punc.status, value: statusLabel(prices.punc.status), detail: prices.note })}
        </div>
      </div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Проверка интеграции</h3><span>э/э → расчетные модули</span></div><div class="panel-body">${electricTariffIntegrationPanel(dataCtx, rates, markup, fskInfo)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>ФСК / ЕНЭС</h3><span>магистральная передача</span></div><div class="panel-body">${fskTariffPanel(fskInfo)}</div></div>
      <div class="split" style="margin-top:14px">
        <div class="panel"><div class="panel-head"><h3>Котловые тарифы</h3><span>${fmtNum(network.length)} строк</span></div><div class="panel-body">${tariffTable(network.slice(0, 8))}</div></div>
        <div class="panel"><div class="panel-head"><h3>Сбытовые надбавки</h3><span>${fmtNum(sales.length)} строк</span></div><div class="panel-body">${salesTable(sales.slice(0, 8))}</div></div>
      </div>
      <div class="note" style="margin-top:14px">Строки с пометкой о неподтвержденном решении РЭК нельзя использовать как финальное основание без source verification.</div>
    </div>
  </div>`;
}

function fskTariffPanel(info){
  const rows = [
    ["Группа субъекта РФ", info.tierLabel, "", ""],
    ["Содержание ЕНЭС", `${fmtNum(info.maintenanceRubMwMonth, 2)} ₽/МВт·мес`, `${fmtNum(info.capacityKw, 0)} кВт`, `${fmtNum(info.maintenanceRubKwh, 5)} ₽/кВт·ч`],
    ["Потери ЕНЭС", info.lossRateRubMwh ? `${fmtNum(info.lossRateRubMwh, 2)} ₽/МВт·ч` : "не задано", `${fmtNum(info.lossNormPct, 3)}%`, `${fmtNum(info.lossRubKwh, 5)} ₽/кВт·ч`],
    ["Итого условно", "", `${fmtNum(info.volumeKwh, 0)} кВт·ч`, `${fmtNum(info.totalRubKwh, 5)} ₽/кВт·ч`],
  ].map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td class="num">${esc(row[2])}</td><td class="num"><b>${esc(row[3])}</b></td></tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Параметр</th><th>Ставка</th><th class="num">База</th><th class="num">Условно на 1 кВт·ч</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="note" style="margin-top:10px">Содержание подтягивается из ${esc(info.sourceName)}. Ставка и норматив потерь ЕНЭС вводятся в Аптайме до подключения автоматического импорта по региону.</div>`;
}

function tariffTable(rows){
  if(!rows.length) return `<div class="empty">Нет строк по выбранному региону</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Период</th><th class="num">ВН</th><th class="num">СН-I</th><th class="num">СН-II</th><th class="num">НН</th><th>Статус</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td>${esc(r.period_start)}</td><td class="num">${fmtNum(r.single_vn_rub_kwh, 4)}</td><td class="num">${fmtNum(r.single_sn1_rub_kwh, 4)}</td><td class="num">${fmtNum(r.single_sn2_rub_kwh, 4)}</td><td class="num">${fmtNum(r.single_nn_rub_kwh, 4)}</td><td>${esc(r.rek_verification_status || "")}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function salesTable(rows){
  if(!rows.length) return `<div class="empty">Нет строк по выбранному региону</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>ГП</th><th>Группа</th><th class="num">Надбавка</th><th>Период</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td>${esc(r.guaranteeing_supplier)}</td><td>${esc(r.consumer_subgroup)}</td><td class="num">${fmtNum(r.sales_markup_rub_kwh_ex_vat, 5)}</td><td>${esc(r.period_start)}-${esc(r.period_end)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function gasTable(rows){
  if(!rows.length) return `<div class="empty">Нет строк по выбранному региону</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Поставщик / ГРО</th><th>Группа</th><th class="num">Опт</th><th class="num">ПССУ</th><th class="num">ГРО</th><th class="num">Спецнадбавка</th><th class="num">Итог H2 без НДС</th><th>Статус</th></tr></thead><tbody>
    ${rows.map((r) => `<tr>
      <td>${esc(r.supplier || "—")}<br><small>${esc(r.gro || "")}</small></td>
      <td>${esc(r.consumer_group)}</td>
      <td class="num">${fmtMaybe(r.wholesale_h2_rub_1000m3_ex_vat)}</td>
      <td class="num">${fmtMaybe(r.pssu_rub_1000m3)}</td>
      <td class="num">${fmtMaybe(r.gro_rub_1000m3)}</td>
      <td class="num">${fmtMaybe(r.special_markup_rub_1000m3)}</td>
      <td class="num">${fmtMaybe(r.final_h2_ex_vat_rub_1000m3)}</td>
      <td>${esc(r.verification_status || r.final_price_status || "")}</td>
    </tr>`).join("")}
  </tbody></table></div>`;
}

function gasComponentTable(priceCtx){
  const row = priceCtx.row || {};
  const components = [
    ["Оптовая цена", row.wholesale_h2_rub_1000m3_ex_vat, "ФАС / ценовой пояс", row.fas_act || ""],
    ["ПССУ", row.pssu_rub_1000m3, "ФАС / группа потребления", row.fas_act || ""],
    ["Транспортировка ГРО", row.gro_rub_1000m3, row.gro || "ГРО", row.transport_period || ""],
    ["Спецнадбавка газификации", row.special_markup_rub_1000m3, "региональный тарифный орган", row.region_act || ""],
  ].map((item) => {
    const value = num(item[1], NaN);
    const status = Number.isFinite(value) && value > 0 ? "loaded" : "draft";
    return `<tr><td>${esc(item[0])}</td><td class="num">${fmtMaybe(item[1])}</td><td>${esc(item[2])}</td><td>${statusBadgeText(status)} ${esc(item[3] || "реквизит не загружен")}</td></tr>`;
  }).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Компонента</th><th class="num">руб./1000 м3 без НДС</th><th>Кто устанавливает / база</th><th>Источник</th></tr></thead><tbody>${components}</tbody>
    <tfoot><tr><td><b>Итог для расчета</b></td><td class="num"><b>${fmtNum(priceCtx.valueRub1000, 2)}</b></td><td>${esc(gasPriceStatusLabel(priceCtx.status))}</td><td>${esc(priceCtx.warning || priceCtx.basis)}</td></tr></tfoot>
  </table></div>`;
}

function gasificationPanel(info){
  return `<div class="status-grid">
    ${availabilityCard({ title: "Газификация субъекта", status: info.status, value: info.label, detail: info.detail })}
    ${availabilityCard({ title: "Ориентир РФ", status: "loaded", value: `${fmtNum(info.nationalPct, 1)}%`, detail: `${info.nationalAsOf}; ${fmtNum(info.technicalPct, 1)}% от технически возможной` })}
    ${availabilityCard({ title: "ГРО в базе", status: info.groCount ? "loaded" : "draft", value: fmtNum(info.groCount), detail: `${fmtNum(info.gasRows)} строк газа; ${fmtNum(info.zoneCount)} зон` })}
  </div>
  <div class="note" style="margin-top:10px">Региональный процент газификации не рассчитывается из тарифных строк. Для управленческого решения он должен загружаться отдельным официальным источником; пока отображается только подтвержденный общероссийский ориентир и локальная обеспеченность газовыми строками.</div>`;
}

function renderGasTariffs(){
  const ctx = App.state.context;
  const gasRows = selectedGasRows();
  const gasRow = selectedGasRow();
  const priceCtx = gasPriceContext(gasRow, ctx.period || puncPeriod(), App.state.generation.gasRub1000m3);
  const gasification = gasificationInfo(ctx.region);
  const groups = Array.from(new Set(gasRows.map((row) => row.consumer_group).filter(Boolean)));
  const groupOptions = groups.length ? groups : [App.state.info.gasGroup || "1–10 млн м³/год"];
  return `<div class="workspace">
    <div class="panel"><div class="panel-head"><h3>Газовая база региона</h3><span>${esc(ctx.region)} · применяется в генерации</span></div><div class="panel-body">
      <div class="form-grid one">
        <div class="field"><label>Субъект РФ</label><select ${updateInput("context.region")}>${getRegions().map((r) => `<option ${r === ctx.region ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
        <div class="field"><label>Группа потребления газа</label><select ${updateInput("info.gasGroup")}>${groupOptions.map((group) => `<option value="${esc(group)}" ${group === App.state.info.gasGroup ? "selected" : ""}>${esc(group)}</option>`).join("")}</select></div>
        <div class="field"><label>Расчетный период</label><input value="${esc(ctx.period)}" ${updateInput("context.period")}></div>
      </div>
      <div class="kpi-grid gas-kpi-grid" style="margin-top:14px">
        <div class="kpi"><small>Цена для генерации</small><strong>${fmtNum(priceCtx.valueRub1000, 0)}</strong><span>руб./1000 м3 без НДС · ${esc(gasPriceStatusLabel(priceCtx.status))}</span></div>
        <div class="kpi"><small>С НДС 22%</small><strong>${fmtNum(priceCtx.valueWithVatRub1000, 0)}</strong><span>руб./1000 м3</span></div>
        <div class="kpi"><small>Полнота компонентов</small><strong>${fmtNum(priceCtx.components.present)}/${fmtNum(priceCtx.components.total)}</strong><span>${esc(priceCtx.row?.final_price_status || "строка не выбрана")}</span></div>
        <div class="kpi"><small>Газификация субъекта</small><strong>${esc(gasification.label)}</strong><span>${esc(gasification.detail)}</span></div>
      </div>
      ${priceCtx.warning ? `<div class="banner warn" style="margin-top:12px">${esc(priceCtx.warning)}</div>` : ""}
    </div></div>
    <div>
      <div class="panel"><div class="panel-head"><h3>Состав цены газа</h3><span>${esc(gasRow?.supplier || "поставщик не выбран")}</span></div><div class="panel-body">${gasComponentTable(priceCtx)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Газификация и доступность</h3><span>для решения по собственной генерации</span></div><div class="panel-body">${gasificationPanel(gasification)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Строки газового тарифа</h3><span>${fmtNum(gasRows.length)} строк</span></div><div class="panel-body">${gasTable(gasRows)}</div></div>
      <div class="note" style="margin-top:14px">Газовая цена для генерации берется из этой вкладки. Если компоненты неполные, модель генерации использует ручную цену и показывает предупреждение, чтобы не занижать OPEX собственной генерации.</div>
    </div>
  </div>`;
}

function renderPunc(){
  const ctx = App.state.context;
  const p = App.state.punc;
  const month = Number(p.month);
  const year = num(p.year, 2026);
  const gpRows = gpRowsForRegion(ctx.region);
  const gpOptions = gpRows.length ? gpRows : [{ name: p.selectedGp || ctx.gp, groups: ["ручной ввод"], avgMarkupRubKwh: currentMarkupRubKwh(), site: p.gpSite, source: "ручной ввод", status: "draft" }];
  const selectedGp = gpOptions.find((r) => cleanSupplierName(r.name) === cleanSupplierName(p.selectedGp || ctx.gp)) || gpOptions[0];
  const priceZone = priceZoneForRegion(ctx.region, selectedGp.name);
  const plan = planHoursForMonth(month, ctx.region, selectedGp.name);
  const availability = puncAvailability();
  const puncCtx = puncDataContext(puncPeriod(), ctx.voltage);
  const bundle = p.loadedBundle;
  const bundleMatches = bundle?.region === ctx.region && cleanSupplierName(bundle.gp) === cleanSupplierName(selectedGp.name);
  const puncDisplayStatus = bundleMatches ? bundle.status : puncCtx.status;
  const lastSearch = p.lastSearch;
  return `<div class="workspace">
    <div class="panel"><div class="panel-head"><h3>Параметры поиска ПУНЦ</h3><span>регион → ГП → период</span></div><div class="panel-body">
      <div class="form-grid one">
        <div class="field"><label>Субъект РФ</label><select ${updateInput("context.region")}>${getRegions().map((r) => `<option ${r === ctx.region ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
        <div class="field"><label>Гарантирующий поставщик в регионе</label><select ${updateInput("punc.selectedGp")}>
          ${gpOptions.map((r) => `<option value="${esc(r.name)}" ${cleanSupplierName(r.name) === cleanSupplierName(selectedGp.name) ? "selected" : ""}>${esc(r.name)}</option>`).join("")}
        </select></div>
        <div class="field"><label>Официальный сайт ГП</label><input value="${esc(p.gpSite || selectedGp.site || "")}" ${updateInput("punc.gpSite")}></div>
        <div class="field"><label>Ценовая зона региона</label><input value="${esc(priceZoneLabel(priceZone))}" disabled></div>
        <div class="row2">
          <div class="field"><label>Год</label><input type="number" value="${esc(year)}" ${updateInput("punc.year", Number)}></div>
          <div class="field"><label>Месяц</label><select ${updateInput("punc.month", Number)}>${Array.from({ length: 12 }, (_, i) => i + 1).map((m) => `<option value="${m}" ${m === month ? "selected" : ""}>${m}</option>`).join("")}</select></div>
        </div>
        <div class="field"><label>Ценовая категория</label><select ${updateInput("punc.priceCategory")}>
          ${["all", "1", "2", "3", "4", "5", "6"].map((v) => `<option value="${v}" ${String(p.priceCategory) === v ? "selected" : ""}>${v === "all" ? "Все ЦК" : `${v} ЦК`}</option>`).join("")}
        </select></div>
        <div class="field"><label>Горизонт загрузки</label><select ${updateInput("punc.horizonMonths", Number)}>${[3,6,12].map((m) => `<option value="${m}" ${num(p.horizonMonths, 3) === m ? "selected" : ""}>${m} мес.</option>`).join("")}</select></div>
        <div class="button-row"><button class="btn" data-click="updatePunc">Обновить контекст</button><button class="btn" data-click="load-punc-bundle">${icon("download")} Загрузить ПУНЦ и часы</button><button class="btn secondary" data-click="punc-search">${icon("search")} Поиск на сайте</button><a class="btn secondary" href="${SOURCE_MODULES.punc}" target="_blank">${icon("link")} исходник</a></div>
      </div>
    </div></div>
    <div>
      <div class="kpi-grid">
        <div class="kpi"><small>ГП в регионе</small><strong>${fmtNum(gpRows.length)}</strong><span>${esc(ctx.region)}</span></div>
        <div class="kpi"><small>Выбранный ГП</small><strong>${esc(selectedGp.name.slice(0, 22))}</strong><span>${esc(selectedGp.groups.slice(0, 2).join("; "))}</span></div>
        <div class="kpi"><small>Часы пика</small><strong>${fmtNum(plan.length)}</strong><span>${esc(priceZoneLabel(priceZone))} · ${esc(planHourLabel(month, ctx.region, selectedGp.name))}</span></div>
        <div class="kpi"><small>ПУНЦ</small><strong>${esc(statusLabel(puncDisplayStatus))}</strong><span>${esc(puncPeriod())} · ${p.priceCategory === "all" ? "все ЦК" : `${p.priceCategory} ЦК`}</span></div>
      </div>
      <div class="status-grid" style="margin-top:14px">${availability.map(availabilityCard).join("")}</div>
      <div class="split" style="margin-top:14px">
        <div class="panel"><div class="panel-head"><h3>ГП по выбранному региону</h3><span>автофильтр</span></div><div class="panel-body">${gpRegionTable(gpRows)}</div></div>
        <div class="panel"><div class="panel-head"><h3>Поиск ПУНЦ на сайте ГП</h3><span>${esc(p.searchStatus || "draft")}</span></div><div class="panel-body">
          <div class="search-box">
            <span>Запрос</span>
            <strong>${esc(puncSearchQuery())}</strong>
            <a class="btn secondary" href="${puncSearchUrl()}" target="_blank">${icon("search")} открыть поиск</a>
          </div>
          ${lastSearch ? `<div class="metering-summary" style="margin-top:12px">
            <div><span>Последний запуск</span><strong>${esc(lastSearch.when)}</strong></div>
            <div><span>Сайт</span><strong>${esc(lastSearch.site)}</strong></div>
            <div><span>Период</span><strong>${esc(lastSearch.period)}</strong></div>
          </div>` : `<div class="empty small">Поиск еще не запускался</div>`}
          ${puncSourceManifestTable(p.sourceManifest)}
          <div class="upload-grid" style="margin-top:12px">
            <label class="upload-box"><span>Ручная загрузка ПУНЦ</span><strong>Excel/PDF/CSV с официальной страницы ГП</strong><input type="file" data-file="punc-source" accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.json,.txt,.pdf"></label>
          </div>
        </div></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Пакет ПУНЦ 1-6 ЦК</h3><span>${esc(p.bundleStatus || "не загружен")}</span></div><div class="panel-body">${puncBundleTable(bundle)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Часы максимума зоны ГП</h3><span>${fmtNum(num(p.horizonMonths, 3))} мес.</span></div><div class="panel-body">${puncPeakHistoryTable(bundle)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Плановые часы по месяцам</h3><span>${esc(priceZoneLabel(priceZone))} · публикация СО, расчет использует индекс hour - 1</span></div><div class="panel-body">
        ${peakHoursTable(priceZone)}
      </div></div>
      <div class="note" style="margin-top:14px">Защита AP-E01: опубликованный час N соответствует индексу N-1 в почасовом профиле.</div>
    </div>
  </div>`;
}

function gpRegionTable(rows){
  if(!rows.length) return `<div class="empty">В локальных данных нет ГП по выбранному региону</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>ГП</th><th>Сайт</th><th>Группы</th><th class="num">Надбавка</th><th>Статус</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${r.site ? `<a href="${esc(r.site)}" target="_blank">${esc(r.site.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : "уточнить"}</td><td>${esc(r.groups.join("; "))}</td><td class="num">${r.avgMarkupRubKwh ? fmtNum(r.avgMarkupRubKwh, 5) : "—"}</td><td>${statusBadgeText(r.status)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function puncSourceManifestTable(manifest){
  if(!manifest) return "";
  const periods = periodRowsFromManifest(manifest);
  const sourceLink = manifest.puncPage ? `<a href="${esc(manifest.puncPage)}" target="_blank">официальная страница</a>` : "источник не закреплен";
  const periodRows = periods.length
    ? periods.map((row) => `<tr><td>${esc(periodLabel(row.period))}</td><td>${row.primaryUrl ? `<a href="${esc(row.primaryUrl)}" target="_blank">${esc(row.fileType || "файл")}</a>` : "—"}</td><td>${statusBadgeText(row.status || manifest.status)}</td></tr>`).join("")
    : `<tr><td colspan="3">${esc(manifest.message || "Файлы не найдены")}</td></tr>`;
  return `<div class="source-manifest">
    <div class="compact-head"><b>Автопроверка источника</b><span>${statusBadgeText(manifest.status)}</span></div>
    <div class="source-line"><span>${sourceLink}</span><span>${esc(manifest.checkedAt || "")}</span></div>
    <div class="table-wrap compact"><table><thead><tr><th>Период</th><th>Файл</th><th>Статус</th></tr></thead><tbody>${periodRows}</tbody></table></div>
  </div>`;
}

function puncCategoryBadge(item){
  const label = `${item.category} ЦК`;
  const status = item.status === "loaded" ? "loaded" : item.status === "queued" ? "queued" : item.status;
  const link = item.source ? ` href="${esc(item.source)}" target="_blank"` : "";
  const tone = status === "loaded" ? "green" : status === "source-found" || status === "uploaded" ? "blue" : "amber";
  return `<a class="badge ${tone}"${link}>${esc(label)}</a>`;
}

function puncBundleTable(bundle){
  if(!bundle?.periods?.length) return `<div class="empty">Пакет ПУНЦ пока не загружен. Выберите ГП и нажмите «Загрузить ПУНЦ и часы».</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Период</th><th>Категории</th><th>Источник</th><th>Статус</th></tr></thead><tbody>
    ${bundle.periods.map((row) => {
      const loaded = row.categories.filter((item) => item.status === "loaded").length;
      const queued = row.categories.filter((item) => item.status === "queued").length;
      const sourceFound = row.categories.filter((item) => item.status === "source-found").length;
      const uploaded = row.categories.filter((item) => item.status === "uploaded").length;
      const status = loaded === row.categories.length ? "loaded" : loaded > 0 ? "partial" : sourceFound === row.categories.length ? "source-found" : uploaded === row.categories.length ? "uploaded" : queued === row.categories.length ? "queued" : "draft";
      return `<tr><td>${esc(periodLabel(row.period))}</td><td><div class="badge-row">${row.categories.map(puncCategoryBadge).join("")}</div></td><td>${esc(row.source)}</td><td>${statusBadgeText(status)}</td></tr>`;
    }).join("")}
  </tbody></table></div>`;
}

function puncPeakHistoryTable(bundle){
  if(!bundle?.periods?.length) return `<div class="empty">Часы максимума будут показаны после загрузки пакета ПУНЦ.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Период</th><th>Тип</th><th>Часы максимума / СО</th><th>Индексы профиля</th><th class="num">Кол-во</th><th>Источник</th><th>Статус</th></tr></thead><tbody>
    ${bundle.periods.map((row) => `<tr><td>${esc(periodLabel(row.period))}</td><td>${row.peakKind === "fact" ? statusBadgeText("loaded") + " факт АТС" : statusBadgeText("plan") + " план СО"}</td><td>${row.peakHours.join(", ") || "нет данных"}</td><td>${row.peakHours.map((h) => h - 1).join(", ") || "—"}</td><td class="num">${fmtNum(row.peakHours.length)}</td><td>${esc(row.peakSource || "")}</td><td>${statusBadgeText(row.peakStatus)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function peakHoursTable(zone = priceZoneForRegion()){
  const planMap = planHoursMapForZone(zone);
  return `<div class="table-wrap"><table><thead><tr><th>Месяц</th><th>Ценовая зона</th><th>Часы СО</th><th>Индексы в профиле</th><th class="num">Количество</th></tr></thead><tbody>
    ${Object.entries(planMap).map(([m, hours]) => `<tr><td>${m}.2026</td><td>${esc(priceZoneLabel(zone))}</td><td>${hours.join(", ")}</td><td>${hours.map((h) => h - 1).join(", ")}</td><td class="num">${hours.length}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function meteringBasis(){
  const ctx = App.state.context;
  const cfg = App.state.categories;
  const intervalMwh = num(cfg.intervalKwh) / 1000;
  const integralMwh = num(cfg.integralKwh) / 1000;
  const volume = intervalMwh > 0 ? intervalMwh : integralMwh > 0 ? integralMwh : num(ctx.monthlyMwh);
  const popl = num(cfg.intervalWorkdayPeakKw) > 0 && num(cfg.intervalPoints) > 0 ? num(cfg.intervalWorkdayPeakKw) / 1000 : num(ctx.poplMw);
  const pchpn = num(cfg.intervalPchpnKw) > 0 && num(cfg.intervalPoints) > 0 ? num(cfg.intervalPchpnKw) / 1000 : num(ctx.pchpnMw);
  const source = intervalMwh > 0 ? "интервальный профиль" : integralMwh > 0 ? "интегральная ведомость" : "ручной ввод";
  return {
    volumeMwh: Math.max(0.001, volume),
    poplMw: Math.max(0, popl),
    pchpnMw: Math.max(0, pchpn),
    source,
    status: cfg.meteringStatus || "Данные учета не загружены",
  };
}

function calcCategories(){
  const cfg = App.state.categories;
  const basis = meteringBasis();
  const volume = basis.volumeMwh;
  const popl = basis.poplMw;
  const pchpn = basis.pchpnMw;
  const prices = pricingBasis(App.state.context.period || puncPeriod(), App.state.context.voltage);
  const rates = prices.rates;
  const markupRubMwh = prices.markupRubMwh;
  const energy = prices.energyRubMwh;
  const infra = prices.infrastructureRubMwh;
  const powerRate = prices.powerRubMwMonth;
  const networkPowerRate = prices.networkPowerRubMwMonth;
  const losses = prices.lossesRubMwh;
  const deviation = volume * num(cfg.deviationPct) / 100 * num(cfg.balancingRubMwh);
  const rows = [
    { ck: 1, basis: "объем", energy: volume * (energy + losses + markupRubMwh), power: 0, network: volume * rates.singleRubKwh * 1000, extra: volume * infra },
    { ck: 2, basis: "зоны суток", energy: volume * (energy * 1.01 + losses + markupRubMwh), power: 0, network: volume * rates.singleRubKwh * 1000, extra: volume * infra },
    { ck: 3, basis: "Pопл", energy: volume * (energy + losses + markupRubMwh), power: popl * powerRate, network: volume * losses, extra: volume * infra },
    { ck: 4, basis: "Pчпн", energy: volume * (energy + losses + markupRubMwh), power: pchpn * powerRate, network: pchpn * networkPowerRate, extra: volume * infra },
    { ck: 5, basis: "Pопл + ППО", energy: volume * (energy * .995 + losses + markupRubMwh), power: popl * powerRate, network: volume * losses, extra: volume * infra + deviation },
    { ck: 6, basis: "Pчпн + ППО", energy: volume * (energy * .995 + losses + markupRubMwh), power: pchpn * powerRate, network: pchpn * networkPowerRate, extra: volume * infra + deviation },
  ];
  return rows.map((r) => ({ ...r, volume, dataSource: prices.source, dataNote: prices.note, total: r.energy + r.power + r.network + r.extra, rateRubKwh: (r.energy + r.power + r.network + r.extra) / volume / 1000 }));
}

function renderCategories(){
  const rows = calcCategories();
  const best = rows.reduce((a, b) => a.total < b.total ? a : b, rows[0]);
  const worst = rows.reduce((a, b) => a.total > b.total ? a : b, rows[0]);
  const ctx = App.state.context;
  const cfg = App.state.categories;
  const basis = meteringBasis();
  const prices = pricingBasis(ctx.period || puncPeriod(), ctx.voltage);
  return `<div class="workspace">
    <div class="panel"><div class="panel-head"><h3>Данные учета и параметры</h3><span>${voltageLabel()}</span></div><div class="panel-body">
      <div class="upload-grid">
        <label class="upload-box">
          <span>Интегральные данные</span>
          <strong>${esc(cfg.integralFileName || "загрузить Excel/CSV/JSON")}</strong>
          <input type="file" data-file="integral-metering" accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.json,.txt">
        </label>
        <label class="upload-box">
          <span>Интервальные данные</span>
          <strong>${esc(cfg.intervalFileName || "загрузить Excel/CSV 24/48/96-точечный профиль")}</strong>
          <input type="file" data-file="interval-metering" accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.json,.txt">
        </label>
      </div>
      <div class="metering-summary" style="margin:12px 0">
        <div><span>Источник</span><strong>${esc(basis.source)}</strong></div>
        <div><span>Объем</span><strong>${fmtNum(basis.volumeMwh, 1)} МВт·ч</strong></div>
        <div><span>Pопл</span><strong>${fmtNum(basis.poplMw, 3)} МВт</strong></div>
        <div><span>Pчпн</span><strong>${fmtNum(basis.pchpnMw, 3)} МВт</strong></div>
      </div>
      <div class="banner info">${esc(basis.status)}</div>
      <div class="banner info">Источник ставок: ${esc(prices.source)} · ${esc(prices.note)}</div>
      <div class="form-grid one">
        <div class="field"><label>Объем, МВт·ч</label><input type="number" value="${esc(ctx.monthlyMwh)}" ${updateInput("context.monthlyMwh", Number)}></div>
        <div class="field"><label>Pопл, МВт</label><input type="number" step="0.001" value="${esc(ctx.poplMw)}" ${updateInput("context.poplMw", Number)}></div>
        <div class="field"><label>Pчпн, МВт</label><input type="number" step="0.001" value="${esc(ctx.pchpnMw)}" ${updateInput("context.pchpnMw", Number)}></div>
        <div class="field"><label>Напряжение</label><select ${updateInput("context.voltage")}>${["VN","SN-I","SN-II","NN"].map((v) => `<option value="${v}" ${v === ctx.voltage ? "selected" : ""}>${voltageLabel(v)}</option>`).join("")}</select></div>
        <div class="field"><label>Энергия РСВ, руб./МВт·ч</label><input type="number" value="${esc(cfg.energyRubMwh)}" ${updateInput("categories.energyRubMwh", Number)}></div>
        <div class="field"><label>Мощность, руб./МВт·мес</label><input type="number" value="${esc(cfg.powerRubMwMonth)}" ${updateInput("categories.powerRubMwMonth", Number)}></div>
        <div class="field"><label>Отклонения ППО, %</label><input type="number" value="${esc(cfg.deviationPct)}" ${updateInput("categories.deviationPct", Number)}></div>
      </div>
      <div class="note" style="margin-top:12px">Загрузка принимает Excel, CSV или JSON с понятными колонками: дата/час, кВт·ч или кВт. Для 4/6 ЦК Pчпн берется по плановым часам региона.</div>
    </div></div>
    <div>
      <div class="kpi-grid">
        <div class="kpi"><small>Лучшая ЦК</small><strong>${best.ck} ЦК</strong><span>${fmtMln(best.total)} без НДС</span></div>
        <div class="kpi"><small>Ставка лучшей</small><strong>${fmtNum(best.rateRubKwh, 2)}</strong><span>руб./кВт·ч без НДС</span></div>
        <div class="kpi"><small>Диапазон эффекта</small><strong>${fmtMln(worst.total - best.total)}</strong><span>между худшей и лучшей ЦК</span></div>
        <div class="kpi"><small>Покрытие интервалов</small><strong>${fmtPct(cfg.intervalCoveragePct, 0)}</strong><span>${fmtNum(cfg.intervalPoints)} точек · КИУМ ${fmtPct(cfg.loadFactorPct, 0)}</span></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>График сравнения</h3><span>итого, руб./мес без НДС</span></div><div class="panel-body">${categoryChart(rows)}</div></div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Сравнение 1-6 ЦК</h3><span>${esc(basis.source)} · ${voltageLabel()}</span></div><div class="panel-body">${categoryTable(rows)}</div></div>
      <div class="note" style="margin-top:14px">Для 4/6 ЦК ставка содержания сети берется по классу напряжения: ВН, СН-I, СН-II или НН. Pmax не используется как база стоимости мощности.</div>
    </div>
  </div>`;
}

function categoryTable(rows){
  const best = rows.reduce((a, b) => a.total < b.total ? a : b, rows[0]);
  return `<div class="table-wrap"><table><thead><tr><th>ЦК</th><th>База</th><th class="num">Энергия</th><th class="num">Мощность</th><th class="num">Сеть</th><th class="num">Прочее</th><th class="num">Итого</th><th class="num">Δ к лучшей</th><th class="num">руб./кВт·ч</th></tr></thead><tbody>
    ${rows.map((r) => {
      const delta = r.total - best.total;
      return `<tr><td>${r.ck} ЦК ${r.ck === best.ck ? statusBadgeText("loaded") : ""}</td><td>${esc(r.basis)}</td><td class="num">${fmtRub(r.energy)}</td><td class="num">${fmtRub(r.power)}</td><td class="num">${fmtRub(r.network)}</td><td class="num">${fmtRub(r.extra)}</td><td class="num"><b>${fmtRub(r.total)}</b></td><td class="num ${delta <= 0 ? "green" : "amber"}">${delta <= 0 ? "0" : "+" + fmtRub(delta)}</td><td class="num">${fmtNum(r.rateRubKwh, 2)}</td></tr>`;
    }).join("")}
  </tbody></table></div>`;
}

function categoryChart(rows){
  const max = Math.max(...rows.map((r) => r.total), 1);
  const best = rows.reduce((a, b) => a.total < b.total ? a : b, rows[0]);
  return `<div class="chart">
    ${rows.map((r) => bar(`${r.ck} ЦК${r.ck === best.ck ? " · минимум" : ""}`, r.total / max * 100, r.ck === best.ck ? "green" : "")).join("")}
  </div>`;
}

function uptimeModeHours(mode, planIndexes){
  const up = App.state.uptime;
  if(mode === "night"){
    return {
      workday: HOURS24.filter((hour) => !planIndexes.includes(hour)),
      nonworking: HOURS24.slice(),
    };
  }
  if(mode === "custom"){
    return {
      workday: cleanHours(up.customWorkdayHours, parseHours(up.customHours)),
      nonworking: cleanHours(up.customNonworkingHours, HOURS24.slice()),
    };
  }
  return { workday: HOURS24.slice(), nonworking: HOURS24.slice() };
}

function calcUptime(){
  const ctx = App.state.context;
  const up = App.state.uptime;
  const period = up.period || ctx.period || "2026-04";
  const [year, month] = String(period).split("-").map(Number);
  const y = Number.isFinite(year) ? year : 2026;
  const m = Number.isFinite(month) ? month : 4;
  const data = ck4Data(period);
  const voltage = up.voltage || ctx.voltage || "SN-II";
  const puncCtx = puncDataContext(period, voltage);
  const plan = planHourIndexes(m);
  const active = uptimeModeHours(up.mode || "full", plan);
  const powerKw = num(ctx.connectedKw, 1000);
  const mw = powerKw / 1000;
  const energyRows = puncCtx.status === "loaded" ? puncCtx.energyRows || [] : [];
  const capacityRow = puncCtx.status === "loaded" ? puncCtx.capacityRow || {} : {};
  const rowByDayHour = new Map(energyRows.map((row) => [`${row.date}:${Number(row.hour_start)}`, row]));
  const totalDays = monthDays(y, m);
  const calendar = [];
  const working = [];
  const nonworking = [];
  let activePoints = 0;
  let energyCost = 0;
  let publishedFinalEnergyCost = 0;
  let svntsemCost = 0;
  let transmissionCost = 0;
  let markupCost = 0;
  let infraCost = 0;
  const fallbackPrices = pricingBasis(period, voltage);
  const fallbackEnergyRate = fallbackPrices.energyRubMwh + fallbackPrices.lossesRubMwh + fallbackPrices.markupRubMwh + fallbackPrices.infrastructureRubMwh;
  for(let day = 1; day <= totalDays; day += 1){
    const date = new Date(Date.UTC(y, m - 1, day));
    const iso = date.toISOString().slice(0, 10);
    const isWork = isWorkingDay(date);
    const hours = isWork ? active.workday : active.nonworking;
    if(isWork) working.push(iso);
    else nonworking.push(iso);
    calendar.push({
      date: iso,
      day,
      weekday: (date.getUTCDay() + 6) % 7,
      is_nonworking: !isWork,
      active_hours_count: hours.length,
      active_hours: hours,
    });
    hours.forEach((hour) => {
      activePoints += 1;
      const row = rowByDayHour.get(`${iso}:${hour}`);
      const finalRate = row ? num(row.final_energy_rate_rub_mwh_no_vat) : fallbackEnergyRate;
      publishedFinalEnergyCost += finalRate * mw;
      svntsemCost += row ? num(row.svntsem_rub_mwh_no_vat) * mw : fallbackPrices.energyRubMwh * mw;
      transmissionCost += row ? num(row.transmission_energy_rate_rub_mwh_no_vat) * mw : fallbackPrices.lossesRubMwh * mw;
      markupCost += row ? num(row.sales_markup_rub_mwh_no_vat) * mw : fallbackPrices.markupRubMwh * mw;
      infraCost += row ? num(row.infrastructure_payments_rub_mwh_no_vat) * mw : fallbackPrices.infrastructureRubMwh * mw;
    });
  }
  const activePlan = active.workday.filter((hour) => plan.includes(hour));
  const networkPlanSlots = working.length * plan.length;
  const networkActivePlanSlots = working.length * activePlan.length;
  const networkCapacityKw = networkPlanSlots ? powerKw * networkActivePlanSlots / networkPlanSlots : 0;
  let purchasedCapacityKw = powerKw;
  let purchasedCapacityBasis = "факт АТС не загружен; верхняя оценка по выбранному профилю";
  const warnings = [];
  if(up.mode === "full" || active.workday.length === 24){
    purchasedCapacityBasis = "факт АТС не загружен; активны все часы рабочих дней";
  } else if(active.workday.length === 0){
    purchasedCapacityKw = 0;
    purchasedCapacityBasis = "0 кВт: в рабочие дни нет выбранных часов работы";
  } else if(activePlan.length === 0){
    purchasedCapacityKw = 0;
    purchasedCapacityBasis = "0 кВт в draft: выбранный профиль не пересекается с плановыми часами СО в рабочих днях; финальный Pопл требует фактических часов АТС";
    warnings.push("Для промышленного расчета Pопл нужно загрузить фактические часы пика АТС; в draft при отсутствии пересечения с плановыми часами СО мощность не начисляется.");
  } else {
    warnings.push("Фактические часы максимума ГП/АТС за месяц не загружены; покупка мощности рассчитана как верхняя оценка.");
  }
  const volumeKwh = powerKw * activePoints;
  const transmissionMode = up.transmissionTariffMode || "regional";
  const fskTransmission = fskTransmissionEquivalent({
    period,
    region: ctx.region,
    volumeKwh,
    capacityKw: networkCapacityKw,
  });
  const regionalTransmissionCost = transmissionCost;
  const transmissionEnergyCost = transmissionMode === "fsk" ? fskTransmission.lossCostRub : regionalTransmissionCost;
  energyCost = svntsemCost + transmissionEnergyCost + markupCost + infraCost;
  if(!energyCost && publishedFinalEnergyCost){
    energyCost = publishedFinalEnergyCost;
  }
  if(transmissionMode === "fsk" && (!fskTransmission.lossRateRubMwh || !fskTransmission.lossNormPct)){
    warnings.push("Выбран тариф ФСК/ЕНЭС: ставка или норматив потерь не заданы, поэтому в расчете учтено только содержание магистральной сети.");
  }
  const purchasedCapacityRate = num(capacityRow.purchased_capacity_rate_rub_mw_month_no_vat, num(up.purchasedCapacityRubMwMonth, 1022211.55));
  const regionalNetworkCapacityRate = num(capacityRow.network_maintenance_rate_rub_mw_month_no_vat, networkRates(selectedNetworkRow(period), voltage).maintenanceRubMwMonth);
  const networkCapacityRate = transmissionMode === "fsk" ? fskTransmission.maintenanceRubMwMonth : regionalNetworkCapacityRate;
  const purchasedCapacityCost = purchasedCapacityKw / 1000 * purchasedCapacityRate;
  const networkCapacityCost = transmissionMode === "fsk" ? fskTransmission.maintenanceCostRub : networkCapacityKw / 1000 * networkCapacityRate;
  const capacityCost = purchasedCapacityCost + networkCapacityCost;
  const subtotal = energyCost + capacityCost;
  const vatRate = num(ctx.vatRate, period >= "2026-01" ? 22 : 20);
  const vatAmount = subtotal * vatRate / 100;
  const total = subtotal + vatAmount;
  const monthHoursTotal = totalDays * 24;
  const dataLoaded = puncCtx.status === "loaded" && energyRows.length > 0;
  const modeRule = up.mode === "night"
    ? "Ночной аптайм: рабочие дни - вне плановых часов СО; выходные и праздники - 24 часа; мощность по плановым часам СО в draft = 0."
    : up.mode === "custom"
      ? "Ручной профиль: отдельные часы для рабочих дней и для выходных/праздников."
      : "Профиль 100%: работа во все часы месяца.";
  return {
    ok: true,
    period,
    y,
    m,
    voltage_code: voltage,
    voltage_level: voltageLabel(voltage),
    power_kw: powerKw,
    mode: up.mode || "full",
    dataLoaded,
    dataStatus: data.status,
    dataError: data.error,
    calendar,
    working_days: working.length,
    nonworking_days: nonworking.length,
    workday_active_hours: active.workday,
    nonworking_active_hours: active.nonworking,
    active_hours_total: activePoints,
    month_hours_total: monthHoursTotal,
    uptime_pct: monthHoursTotal ? activePoints * 100 / monthHoursTotal : 0,
    working_active_hours_total: working.length * active.workday.length,
    nonworking_active_hours_total: nonworking.length * active.nonworking.length,
    plan_hours: plan.map((hour) => hour + 1),
    plan_hour_indexes: plan,
    active_plan_hours: activePlan.map((hour) => hour + 1),
    network_plan_slots: networkPlanSlots,
    network_active_plan_slots: networkActivePlanSlots,
    purchased_capacity_kw: purchasedCapacityKw,
    network_capacity_kw: networkCapacityKw,
    pchpn_kw: networkCapacityKw,
    purchased_capacity_basis: purchasedCapacityBasis,
    network_capacity_basis: "средняя мощность по всем плановым часам СО в рабочих днях производственного календаря",
    mode_rule: modeRule,
    warnings,
    volume_kwh: volumeKwh,
    volume_mwh: volumeKwh / 1000,
    energy_cost_no_vat: energyCost,
    svntsem_cost_no_vat: svntsemCost,
    transmission_cost_no_vat: transmissionEnergyCost,
    regional_transmission_cost_no_vat: regionalTransmissionCost,
    sales_markup_cost_no_vat: markupCost,
    sales_markup_available: dataLoaded,
    sales_markup_basis: dataLoaded ? "опубликованный почасовой компонент в составе ставки за электрическую энергию" : "fallback по локальному тарифному модулю; компонентная детализация месяца не загружена",
    sales_markup_capacity_equivalent_rate_rub_mw_month_no_vat: mw ? markupCost / mw : 0,
    infrastructure_cost_no_vat: infraCost,
    transmission_tariff_mode: transmissionMode,
    transmission_tariff_label: transmissionMode === "fsk" ? "ФСК / ЕНЭС" : `региональный котел ${voltageLabel(voltage)}`,
    fsk_tier_label: fskTransmission.tierLabel,
    fsk_maintenance_rate_rub_mw_month_no_vat: fskTransmission.maintenanceRubMwMonth,
    fsk_loss_rate_rub_mwh_no_vat: fskTransmission.lossRateRubMwh,
    fsk_loss_norm_pct: fskTransmission.lossNormPct,
    fsk_loss_volume_mwh: fskTransmission.lossVolumeMwh,
    fsk_loss_cost_no_vat: fskTransmission.lossCostRub,
    fsk_maintenance_equivalent_rub_kwh_no_vat: fskTransmission.maintenanceRubKwh,
    fsk_loss_equivalent_rub_kwh_no_vat: fskTransmission.lossRubKwh,
    fsk_total_equivalent_rub_kwh_no_vat: fskTransmission.totalRubKwh,
    fsk_source_name: fskTransmission.sourceName,
    fsk_source_url: fskTransmission.sourceUrl,
    fsk_loss_source_name: fskTransmission.lossSourceName,
    fsk_loss_source_url: fskTransmission.lossSourceUrl,
    purchased_capacity_rate_rub_mw_month_no_vat: purchasedCapacityRate,
    network_capacity_rate_rub_mw_month_no_vat: networkCapacityRate,
    purchased_capacity_cost_no_vat: purchasedCapacityCost,
    network_capacity_cost_no_vat: networkCapacityCost,
    capacity_cost_no_vat: capacityCost,
    subtotal_no_vat: subtotal,
    vat_rate: vatRate,
    vat_amount: vatAmount,
    total_with_vat: total,
    energy_rate_rub_kwh_no_vat: volumeKwh ? energyCost / volumeKwh : 0,
    capacity_rate_rub_kwh_no_vat: volumeKwh ? capacityCost / volumeKwh : 0,
    reduced_rate_rub_kwh_no_vat: volumeKwh ? subtotal / volumeKwh : 0,
    reduced_rate_rub_kwh_with_vat: volumeKwh ? total / volumeKwh : 0,
    source_file: data.summary?.source_file || "локальный тарифный модуль",
    source_url: data.summary?.source_url || "",
    source_sha256: data.summary?.source_sha256 || "",
    component_detail_status: data.summary?.component_detail_status || (dataLoaded ? "published_components" : "fallback"),
  };
}

function renderUptime(){
  const r = calcUptime();
  const s = App.state.uptime;
  const periodOpts = CK4_PERIODS.map((period) => `<option value="${period}" ${r.period === period ? "selected" : ""}>${periodLabel(period)}</option>`).join("");
  const volts = ["VN","SN-I","SN-II","NN"].map((code) => `<option value="${code}" ${r.voltage_code === code ? "selected" : ""}>${voltageLabel(code)}</option>`).join("");
  const modeBtn = (mode, label) => `<button type="button" class="seg ${r.mode === mode ? "on" : ""}" data-click="set-uptime-mode" data-value="${mode}">${label}</button>`;
  return `<div id="uptime_calculator" class="ck4-screen">
    <div class="panel">
      <div class="panel-head">
        <div><h3>Калькулятор 4 ЦК</h3><span>фиксированная мощность · фактические почасовые ставки · ₽/кВт·ч</span></div>
        ${statusBadgeText(r.dataLoaded ? "loaded" : r.dataStatus)}
      </div>
      <div class="panel-body">
        <div class="ck4-calc">
          <div class="ck4-form">
            <div class="field"><label>Месяц расчёта</label><select ${updateInput("uptime.period")}>${periodOpts}</select></div>
            <div class="row2">
              <div class="field"><label>Мощность потребления, кВт</label><input type="text" inputmode="decimal" value="${esc(App.state.context.connectedKw)}" ${updateInput("context.connectedKw", Number)} data-no-live="true"></div>
              <div class="field"><label>Класс напряжения</label><select ${updateInput("uptime.voltage")}>${volts}</select></div>
            </div>
            <div class="row2">
              <div class="field"><label>Тариф передачи</label><select ${updateInput("uptime.transmissionTariffMode")}>
                <option value="regional" ${s.transmissionTariffMode !== "fsk" ? "selected" : ""}>Региональный котел</option>
                <option value="fsk" ${s.transmissionTariffMode === "fsk" ? "selected" : ""}>ФСК / ЕНЭС</option>
              </select></div>
              <div class="field"><label>Содержание ФСК, руб./МВт·мес</label><input value="${fmtNum(r.fsk_maintenance_rate_rub_mw_month_no_vat, 2)}" disabled></div>
            </div>
            ${s.transmissionTariffMode === "fsk" ? `<div class="row2">
              <div class="field"><label>Потери ФСК, руб./МВт·ч</label><input type="text" inputmode="decimal" value="${esc(s.fskLossRateRubMwh)}" ${updateInput("uptime.fskLossRateRubMwh", Number)} data-no-live="true"></div>
              <div class="field"><label>Норматив потерь ФСК, %</label><input type="text" inputmode="decimal" value="${esc(s.fskLossNormPct)}" ${updateInput("uptime.fskLossNormPct", Number)} data-no-live="true"></div>
            </div>` : ""}
            <div class="field"><label>Профиль работы</label>
              <div class="segbar">
                ${modeBtn("full", "100%")}
                ${modeBtn("night", "Вне плановых часов")}
                ${modeBtn("custom", "Ручной выбор")}
              </div>
            </div>
            <div class="hour-columns">
              ${uptimeHourSection("workday", "Рабочие дни", "участвуют в Pчпн", r.workday_active_hours, r.plan_hour_indexes, r.mode)}
              ${uptimeHourSection("nonworking", "Выходные и праздники", "в Pчпн не входят", r.nonworking_active_hours, [], r.mode)}
            </div>
            <div class="ck4-calendar">${uptimeCalendarHtml(r)}</div>
          </div>
          <div class="ck4-result">${uptimeResultHtml(r)}</div>
        </div>
      </div>
    </div>
  </div>`;
}

function uptimeHourSection(kind, title, subtitle, activeHours, planHours, mode){
  const active = new Set(activeHours);
  const plan = new Set(planHours);
  const disabled = mode !== "custom" ? "disabled" : "";
  const buttons = HOURS24.map((hour) => `<button type="button" class="hour-toggle ${active.has(hour) ? "active" : ""} ${plan.has(hour) ? "plan" : ""}" ${disabled} data-click="toggle-uptime-hour" data-value="${kind}:${hour}">
    <span>${hourText(hour)}</span>
  </button>`).join("");
  return `<div class="hour-section">
    <div class="hour-section-head"><b>${esc(title)}</b><span>${esc(subtitle)}</span></div>
    <div class="hour-grid ${mode !== "custom" ? "locked" : ""}">${buttons}</div>
  </div>`;
}

function uptimeCalendarHtml(r){
  const head = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => `<span>${d}</span>`).join("");
  const blanks = Array(r.calendar[0]?.weekday || 0).fill(0).map(() => `<div class="cal-day empty-day"></div>`).join("");
  const cells = r.calendar.map((d) => `<div class="cal-day ${d.is_nonworking ? "nonworking" : "working"}" title="${esc(d.date)} · ${d.active_hours_count} ч">
    <b>${d.day}</b><span>${d.active_hours_count} ч</span>
  </div>`).join("");
  return `<div class="cal-head"><b>Календарь ${periodLabel(r.period)}</b><span><i></i> выходные/праздники</span></div>
    <div class="cal-weekdays">${head}</div><div class="cal-grid">${blanks}${cells}</div>`;
}

function uptimeResultHtml(r){
  const plan = r.plan_hours.join(", ");
  const activePlan = r.active_plan_hours.length ? r.active_plan_hours.join(", ") : "нет";
  const salesAmount = r.sales_markup_available ? fmtRub(r.sales_markup_cost_no_vat, 2) : "—";
  const salesRate = r.sales_markup_available && r.volume_kwh ? `${fmtNum(r.sales_markup_cost_no_vat / r.volume_kwh, 4)} ₽/кВт·ч` : "fallback";
  const networkCapacityLabel = r.transmission_tariff_mode === "fsk" ? "Мощность: содержание ФСК/ЕНЭС" : "Мощность: содержание сетей";
  const fskLossRows = r.transmission_tariff_mode === "fsk" ? [[
    "Потери ФСК/ЕНЭС",
    `${fmtNum(r.fsk_loss_volume_mwh, 4)} МВт·ч`,
    `${fmtNum(r.fsk_loss_rate_rub_mwh_no_vat, 2)} ₽/МВт·ч`,
    fmtRub(r.fsk_loss_cost_no_vat, 2),
    "included",
  ]] : [];
  const rows = [
    ["Электроэнергия", `${fmtNum(r.volume_kwh, 0)} кВт·ч`, `${fmtNum(r.energy_rate_rub_kwh_no_vat, 4)} ₽/кВт·ч`, fmtRub(r.energy_cost_no_vat, 2), ""],
    ["Сбытовая надбавка ГП", r.sales_markup_available ? `${fmtNum(r.volume_kwh, 0)} кВт·ч` : "—", salesRate, salesAmount, "included"],
    ...fskLossRows,
    ["Мощность: покупка", `${fmtNum(r.purchased_capacity_kw, 0)} кВт`, `${fmtNum(r.purchased_capacity_rate_rub_mw_month_no_vat, 2)} ₽/МВт·мес`, fmtRub(r.purchased_capacity_cost_no_vat, 2), ""],
    [networkCapacityLabel, `${fmtNum(r.network_capacity_kw, 0)} кВт`, `${fmtNum(r.network_capacity_rate_rub_mw_month_no_vat, 2)} ₽/МВт·мес`, fmtRub(r.network_capacity_cost_no_vat, 2), ""],
    [`НДС`, `${fmtNum(r.vat_rate, 0)}%`, "", fmtRub(r.vat_amount, 2), ""],
  ].map((x) => `<tr class="${x[4] === "included" ? "included-row" : ""}"><td>${x[0]}${x[4] === "included" ? "<small>в составе электроэнергии</small>" : ""}</td><td class="num">${x[1]}</td><td class="num muted">${x[2]}</td><td class="num"><b>${x[3]}</b></td></tr>`).join("");
  const warnings = r.warnings.map((w) => `<div class="banner warn">${esc(w)}</div>`).join("");
  const componentNote = r.component_detail_status === "fallback" ? `<div class="banner info">Почасовой файл периода не загружен; показан fallback по локальному тарифному модулю.</div>` : "";
  const fskNote = r.transmission_tariff_mode === "fsk"
    ? `<div>ФСК/ЕНЭС условно: содержание <b>${fmtNum(r.fsk_maintenance_equivalent_rub_kwh_no_vat, 5)}</b> ₽/кВт·ч, потери <b>${fmtNum(r.fsk_loss_equivalent_rub_kwh_no_vat, 5)}</b> ₽/кВт·ч, всего <b>${fmtNum(r.fsk_total_equivalent_rub_kwh_no_vat, 5)}</b> ₽/кВт·ч.</div>
      <div>Источник ФСК: ${esc(r.fsk_source_name)}; потери: ${esc(r.fsk_loss_source_name)}.</div>`
    : "";
  return `<div class="rate-hero">
      <div><span>Приведенная стоимость с НДС</span><b>${fmtNum(r.reduced_rate_rub_kwh_with_vat, 4)} ₽/кВт·ч</b></div>
      <small>без НДС: ${fmtNum(r.reduced_rate_rub_kwh_no_vat, 4)} ₽/кВт·ч</small>
    </div>
    <div class="calc-metrics">
      <div><span>Объём</span><b>${fmtNum(r.volume_kwh, 0)}</b><small>кВт·ч</small></div>
      <div><span>Аптайм</span><b>${fmtNum(r.uptime_pct, 1)}%</b><small>${fmtNum(r.active_hours_total)} из ${fmtNum(r.month_hours_total)} ч</small></div>
      <div><span>Покупка</span><b>${fmtNum(r.purchased_capacity_kw, 0)}</b><small>кВт</small></div>
      <div><span>Сети</span><b>${fmtNum(r.network_capacity_kw, 0)}</b><small>кВт</small></div>
    </div>
    <div class="table-wrap flat"><table class="calc-table"><thead><tr><th>Компонента</th><th class="num">База</th><th class="num">Ставка</th><th class="num">Сумма</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="calc-note">
      <div>${esc(r.mode_rule)}</div>
      <div>Рабочие дни: <b>${fmtNum(r.working_days)}</b> (${fmtNum(r.working_active_hours_total)} ч); выходные/праздничные: <b>${fmtNum(r.nonworking_days)}</b> (${fmtNum(r.nonworking_active_hours_total)} ч).</div>
      <div>Плановые часы СО: <b>${esc(plan)}</b>; пересечение в рабочие дни: <b>${esc(activePlan)}</b>; слоты Pчпн: <b>${fmtNum(r.network_active_plan_slots)}/${fmtNum(r.network_plan_slots)}</b>.</div>
      <div>Покупка мощности: ${esc(r.purchased_capacity_basis)}. Тариф передачи: <b>${esc(r.transmission_tariff_label)}</b>; ${esc(r.network_capacity_basis)}.</div>
      <div>Сбытовая надбавка: ${esc(r.sales_markup_basis)}.</div>
      ${fskNote}
      <div>Источник: ${esc(r.source_file)} · ${esc(r.source_sha256 || "sha256 не указан")}</div>
    </div>
    ${componentNote}
    ${warnings}`;
}

function moneyBar(label, value, total, tone = ""){
  const pct = total ? value / total * 100 : 0;
  return bar(label, pct, tone).replace(`<b>${fmtPct(pct, 0)}</b>`, `<b>${fmtMln(value)}</b>`);
}

function getOremGp(){
  return OREM_GP_REGISTRY.find((item) => item.id === App.state.orem.selectedGpId) || OREM_GP_REGISTRY[0];
}

function normalizeAddressText(value){
  return String(value || "").toLowerCase().replace(/ё/g, "е").replace(/[«»"]/g, "").replace(/\s+/g, " ").trim();
}

function oremGpById(id){
  return OREM_GP_REGISTRY.find((item) => item.id === id) || OREM_GP_REGISTRY[0];
}

function inferOremAddressRule(address = App.state.orem.addressText){
  const normalized = normalizeAddressText(address);
  const scored = OREM_ADDRESS_RULES.map((rule) => ({
    ...rule,
    score: rule.tokens.reduce((sum, token) => sum + (normalized.includes(normalizeAddressText(token)) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score || b.confidence - a.confidence);
  const best = scored[0];
  if(best?.score > 0) return best;
  const regionRule = OREM_ADDRESS_RULES.find((rule) => rule.region === App.state.context.region);
  return regionRule || OREM_ADDRESS_RULES[0];
}

function geocodeOremAddressLocal(address = App.state.orem.addressText, coordinates = App.state.orem.coordinates){
  const rule = inferOremAddressRule(address);
  const direct = parseOremCoordinates(coordinates || address);
  const isPresetCoordinate = Math.abs(direct.lat - OREM_ADDRESS_PRESET.lat) < 0.00001 && Math.abs(direct.lon - OREM_ADDRESS_PRESET.lon) < 0.00001;
  if(!direct.inferred && !(isPresetCoordinate && rule.gpId !== OREM_ADDRESS_PRESET.gpId)){
    return { ...direct, confidence: 92, source: "координаты введены вручную", region: rule.region, gpId: rule.gpId };
  }
  return {
    lat: rule.lat,
    lon: rule.lon,
    source: rule.source,
    inferred: true,
    confidence: rule.confidence,
    region: rule.region,
    gpId: rule.gpId,
  };
}

function getOremNodes(gpId = App.state.orem.selectedGpId){
  return OREM_NODE_REGISTRY.filter((item) => item.gpId === gpId);
}

function getOremNode(id){
  return OREM_NODE_REGISTRY.find((item) => item.id === id) || getOremNodes()[0] || OREM_NODE_REGISTRY[0];
}

function getOremMarkupGroup(){
  return OREM_MARKUP_GROUPS.find((item) => item.id === App.state.orem.selectedMarkupGroup) || OREM_MARKUP_GROUPS[1];
}

function oremMarkupRate(period = App.state.orem.selectedMarkupPeriod, group = getOremMarkupGroup()){
  return period === "octDec" ? group.future : group.current;
}

function parseOremCoordinates(text){
  const match = String(text || "").match(/(-?\d+(?:[.,]\d+)?)\s*[,; ]\s*(-?\d+(?:[.,]\d+)?)/);
  if(match) return { lat: Number(match[1].replace(",", ".")), lon: Number(match[2].replace(",", ".")), source: "manual", inferred: false };
  return { lat: OREM_ADDRESS_PRESET.lat, lon: OREM_ADDRESS_PRESET.lon, source: "preset", inferred: true };
}

function haversineKm(aLat, aLon, bLat, bLon){
  const radius = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const aa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
}

function nearestOremNodes(limit = 5, gpId = App.state.orem.selectedGpId, point = geocodeOremAddressLocal(App.state.orem.addressText, App.state.orem.coordinates)){
  const nodes = getOremNodes(gpId);
  return nodes
    .map((node) => ({
      ...node,
      distanceKm: haversineKm(point.lat, point.lon, node.lat, node.lon),
      addressPoint: point,
      preferredForAddress: node.nodeId === OREM_ADDRESS_PRESET.preferredNodeId && oremGpById(gpId).territory === "Красноярский край",
    }))
    .sort((a, b) => {
      if(a.preferredForAddress && !b.preferredForAddress) return -1;
      if(!a.preferredForAddress && b.preferredForAddress) return 1;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);
}

function buildOremAddressBinding(){
  const o = App.state.orem;
  const point = geocodeOremAddressLocal(o.addressText, o.coordinates);
  const rule = inferOremAddressRule(o.addressText);
  const gp = oremGpById(point.gpId || rule.gpId);
  const nodes = getOremNodes(gp.id)
    .map((node) => ({
      ...node,
      distanceKm: haversineKm(point.lat, point.lon, node.lat, node.lon),
      preferredForAddress: node.nodeId === OREM_ADDRESS_PRESET.preferredNodeId && gp.id === OREM_ADDRESS_PRESET.gpId,
    }))
    .sort((a, b) => {
      if(a.preferredForAddress && !b.preferredForAddress) return -1;
      if(!a.preferredForAddress && b.preferredForAddress) return 1;
      return a.distanceKm - b.distanceKm;
    });
  const buyer = nodes[0] || OREM_NODE_REGISTRY[0];
  const seller = nodes.find((node) => node.id === "node-kes-zone") || nodes.find((node) => String(node.voltage).includes("агрегат")) || nodes[0] || buyer;
  const confidence = Math.round(Math.min(96, (point.confidence || 70) * 0.45 + gp.confidence * 0.3 + (buyer.quality || 60) * 0.25));
  return { point, rule, gp, buyer, seller, nodes, confidence };
}

function calcRuc(){
  const o = App.state.orem;
  const buyer = getOremNode(o.selectedBuyerNodeId);
  const seller = getOremNode(o.selectedSellerNodeId);
  const diffs = buyer.rsv.map((price, index) => price - num(seller.rsv[index]));
  const avgBuyer = mean(buyer.rsv);
  const avgSeller = mean(seller.rsv);
  const avgDiff = mean(diffs);
  const volume = num(o.volumeMwh || App.state.context.monthlyMwh);
  const effectCost = -avgDiff * volume;
  const unconfirmed = [buyer, seller].filter((node) => node.status !== "confirmed");
  const quality = Math.round((buyer.quality + seller.quality + getOremGp().confidence) / 3);
  return {
    buyer,
    seller,
    diffs,
    avgBuyer,
    avgSeller,
    avgDiff,
    minDiff: Math.min(...diffs),
    maxDiff: Math.max(...diffs),
    volume,
    effectCost,
    quality,
    unconfirmed,
  };
}

function calcOrem(){
  const ruc = calcRuc();
  const o = App.state.orem;
  const volumeKwh = ruc.volume * 1000;
  const nodeRubKwh = ruc.avgBuyer / 1000;
  const gpZoneRubKwh = ruc.avgSeller / 1000;
  const nodeEffectRubKwh = -ruc.avgDiff / 1000;
  const markupGroup = getOremMarkupGroup();
  const currentGpMarkupRubKwh = oremMarkupRate("janSep", markupGroup);
  const futureGpMarkupRubKwh = oremMarkupRate("octDec", markupGroup);
  const gpMarkupRubKwh = oremMarkupRate(o.selectedMarkupPeriod, markupGroup);
  const up = calcUptime();
  const pchpnMw = num(up.network_capacity_kw, num(App.state.context.pchpnMw) * 1000) / 1000;
  const retailCapacityCostRub = num(o.retailCapacityMw) * num(o.retailCapacityTariff);
  const oremCapacityCostRub = pchpnMw * num(o.oremCapacityTariff);
  const capacityEffectRub = retailCapacityCostRub - oremCapacityCostRub;
  const capacityAdjustmentRubKwh = volumeKwh ? capacityEffectRub / volumeKwh : 0;
  const infraRubMwh = num(o.oremInfraSoRubMwh) + num(o.oremInfraAtsRubMwh) + num(o.oremInfraCfrRubMwh);
  const infraCostRub = ruc.volume * infraRubMwh;
  const infrastructureEffectRubKwh = volumeKwh ? -infraCostRub / volumeKwh : 0;
  const serviceRubMwh = num(o.oremServicesRubMwh) + num(o.intermediaryRubMwh);
  const serviceEffectRubKwh = -serviceRubMwh / 1000;
  const currentWholesaleEffectRubKwh = nodeEffectRubKwh + currentGpMarkupRubKwh + capacityAdjustmentRubKwh + infrastructureEffectRubKwh;
  const futureWholesaleEffectRubKwh = nodeEffectRubKwh + futureGpMarkupRubKwh + capacityAdjustmentRubKwh + infrastructureEffectRubKwh;
  const periodWholesaleEffectRubKwh = nodeEffectRubKwh + gpMarkupRubKwh + capacityAdjustmentRubKwh + infrastructureEffectRubKwh;
  const periodNetEffectRubKwh = periodWholesaleEffectRubKwh + serviceEffectRubKwh;
  const src = App.data.oremHistory?.summaries?.[o.activeHistoryHorizon] || App.data.oremHistory?.summaries?.["365"] || null;
  return {
    ...ruc,
    markupGroup,
    currentGpMarkupRubKwh,
    futureGpMarkupRubKwh,
    gpMarkupRubKwh,
    nodeRubKwh,
    gpZoneRubKwh,
    nodeEffectRubKwh,
    capacity: {
      pchpnMw,
      retailCapacityMw: num(o.retailCapacityMw),
      retailCapacityTariff: num(o.retailCapacityTariff),
      oremCapacityTariff: num(o.oremCapacityTariff),
      retailCapacityCostRub,
      oremCapacityCostRub,
      effectRub: capacityEffectRub,
      effectRubKwh: capacityAdjustmentRubKwh,
    },
    infrastructure: {
      soRubMwh: num(o.oremInfraSoRubMwh),
      atsRubMwh: num(o.oremInfraAtsRubMwh),
      cfrRubMwh: num(o.oremInfraCfrRubMwh),
      totalRubMwh: infraRubMwh,
      costRub: infraCostRub,
      effectRubKwh: infrastructureEffectRubKwh,
    },
    service: {
      totalRubMwh: serviceRubMwh,
      effectRubKwh: serviceEffectRubKwh,
      costRub: serviceRubMwh * ruc.volume,
    },
    currentWholesaleEffectRubKwh,
    futureWholesaleEffectRubKwh,
    periodWholesaleEffectRubKwh,
    periodNetEffectRubKwh,
    currentWholesaleEffectRub: currentWholesaleEffectRubKwh * volumeKwh,
    futureWholesaleEffectRub: futureWholesaleEffectRubKwh * volumeKwh,
    periodWholesaleEffectRub: periodWholesaleEffectRubKwh * volumeKwh,
    periodNetEffectRub: periodNetEffectRubKwh * volumeKwh,
    src,
    warning: App.data.oremHistory?.reference?.warning || "Профиль РУЦ требует подтверждения источниками АТС.",
  };
}

function renderOrem(){
  const active = App.state.orem.tab || "calc";
  return `<div class="orem-screen">
    <div class="tabs inner-tabs" role="tablist">
      ${oremTab("calc", "Расчёт Δ РУЦ", active)}
      ${oremTab("effect", "Эффективность ОРЭМ", active)}
      ${oremTab("history", "История РУЦ", active)}
    </div>
    ${active === "effect" ? renderOremEffect() : active === "history" ? renderOremHistory() : renderOremCalc()}
  </div>`;
}

function oremTab(id, label, active){
  return `<button type="button" class="tab ${active === id ? "active" : ""}" data-click="set-orem-tab" data-value="${id}" role="tab" aria-selected="${active === id}">${esc(label)}</button>`;
}

function renderOremCalc(){
  const result = calcOrem();
  return `<div class="orem-workspace">
    <div class="left-column">
      ${oremCalculationPanel(result)}
      ${oremResultPanel(result)}
    </div>
    <div class="center-column">
      ${oremAddressPanel()}
      ${oremChartPanel(result)}
    </div>
    <div class="right-column">
      ${oremSideRegistriesPanel()}
      ${oremQualityPanel(result)}
    </div>
  </div>`;
}

function oremCalculationPanel(result){
  const gp = getOremGp();
  const nodes = getOremNodes();
  return `<section class="panel">
    <div class="panel-head"><div><h3>1. Параметры расчёта</h3><span>Базовый сценарий: РСВ по узлу сети и зоне ГП</span></div><span class="badge blue">MVP</span></div>
    <div class="panel-body">
      <div class="form-grid one">
        <div class="field"><label>Зона ГП</label><select ${updateInput("orem.selectedGpId")}>${OREM_GP_REGISTRY.map((item) => `<option value="${item.id}" ${item.id === gp.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Узел сети (покупатель)</label><select ${updateInput("orem.selectedBuyerNodeId")}>${nodes.map((item) => `<option value="${item.id}" ${item.id === result.buyer.id ? "selected" : ""}>${esc(item.name)} · ${esc(item.nodeId)}</option>`).join("")}</select></div>
        <div class="field"><label>Зона/узел ГП (продавец)</label><select ${updateInput("orem.selectedSellerNodeId")}>${nodes.map((item) => `<option value="${item.id}" ${item.id === result.seller.id ? "selected" : ""}>${esc(item.name)} · ${esc(item.nodeId)}</option>`).join("")}</select></div>
        <div class="form-grid">
          <div class="field"><label>Период</label><input type="date" value="${esc(App.state.orem.selectedPeriod)}" ${updateInput("orem.selectedPeriod")}></div>
          <div class="field"><label>Горизонт</label><select ${updateInput("orem.periodMode")}><option value="day" ${App.state.orem.periodMode === "day" ? "selected" : ""}>Сутки (24 часа)</option><option value="month" ${App.state.orem.periodMode === "month" ? "selected" : ""}>Месяц</option></select></div>
        </div>
        <div class="field"><label>Плановый объём, МВт·ч</label><input type="number" min="0" step="0.1" value="${esc(result.volume)}" ${updateInput("orem.volumeMwh", Number)}></div>
        <div class="button-row"><button class="btn" type="button" data-click="set-orem-tab" data-value="effect">Рассчитать ОРЭМ</button><a class="btn secondary" href="${SOURCE_MODULES.orem}" target="_blank">${icon("link")} исходник</a></div>
        ${result.unconfirmed.length ? `<div class="notice warn"><strong>node_id не подтверждён:</strong> ${esc(result.unconfirmed.map((node) => node.name).join(", "))}. Для боевого расчёта нужен мэппинг АТС/ГТП.</div>` : `<div class="notice"><strong>Узлы подтверждены в demo-реестре.</strong> Перед внешним использованием нужна сверка источников.</div>`}
      </div>
    </div>
  </section>`;
}

function oremResultPanel(result){
  const deltaTone = result.avgDiff <= 0 ? "green" : "red";
  const effectToneClass = result.nodeEffectRubKwh >= 0 ? "green" : "red";
  return `<section class="panel">
    <div class="panel-head"><div><h3>2. Результаты расчёта</h3><span>Период: ${esc(App.state.orem.selectedPeriod)} · ${App.state.orem.periodMode === "day" ? "24 часа" : "месяц"}</span></div></div>
    <div class="panel-body">
      <div class="kpi-grid compact-kpis">
        <div class="kpi accent-${deltaTone}"><small>Δ РУЦ (узел - ГП)</small><strong class="${deltaTone}">${fmtSignedRub(result.avgDiff, 2)}</strong><span>${result.avgDiff <= 0 ? "узел дешевле ГП" : "узел дороже ГП"} · руб./МВт·ч</span></div>
        <div class="kpi accent-${effectToneClass}"><small>Эффект 1 кВт·ч</small><strong class="${effectToneClass}">${fmtSignedRub(result.nodeEffectRubKwh, 4)}</strong><span>${fmtKop(result.nodeEffectRubKwh, 2)} · ${result.nodeEffectRubKwh >= 0 ? "экономия" : "удорожание"}</span></div>
        <div class="kpi"><small>Цена узла</small><strong>${fmtNum(result.avgBuyer, 2)}</strong><span>руб./МВт·ч</span></div>
        <div class="kpi"><small>Цена зоны ГП</small><strong>${fmtNum(result.avgSeller, 2)}</strong><span>руб./МВт·ч</span></div>
        <div class="kpi accent-amber"><small>Качество</small><strong class="amber">${fmtPct(result.quality, 0)}</strong><span>${result.quality >= 80 ? "достаточно для черновика" : "требует проверки"}</span></div>
      </div>
      <div class="quality-list" style="margin-top:12px">
        <div class="quality-row"><b>Эффект по объёму</b><span class="${effectToneClass}">${fmtSignedRub(result.effectCost, 0)} без НДС</span></div>
        <div class="quality-row"><b>Максимальная Δ за час</b><span>${fmtNum(result.maxDiff, 2)} руб./МВт·ч</span></div>
        <div class="quality-row"><b>Минимальная Δ за час</b><span>${fmtNum(result.minDiff, 2)} руб./МВт·ч</span></div>
      </div>
    </div>
  </section>`;
}

function oremAddressPanel(){
  const binding = buildOremAddressBinding();
  const point = binding.point;
  const near = nearestOremNodes(5, binding.gp.id, point);
  return `<section class="panel">
    <div class="panel-head"><div><h3>3. Физический адрес абонента</h3><span>Поиск ГП и привязка к узлу системы</span></div><span class="badge ${point.inferred ? "amber" : "green"}">${point.inferred ? "координаты оценены" : "координаты заданы"}</span></div>
    <div class="panel-body">
      <div class="inline-tabs"><button class="active" type="button">Адрес</button><button type="button">Координаты</button></div>
      <div class="form-grid">
        <div class="field"><label>Адрес объекта / абонента</label><input value="${esc(App.state.orem.addressText)}" ${updateInput("orem.addressText")}></div>
        <div class="field"><label>Координаты lat, lon</label><input value="${esc(App.state.orem.coordinates)}" ${updateInput("orem.coordinates")}></div>
      </div>
      <div class="button-row field-actions">
        <button class="btn" type="button" data-click="orem-bind-address">${icon("search")} Найти ГП и узел</button>
        <button class="btn secondary" type="button" data-click="orem-preset-krasny-yar">Красный Яр</button>
        <button class="btn secondary" type="button" data-click="set-orem-tab" data-value="history">История РУЦ</button>
      </div>
      ${oremAddressBindingSummary(binding)}
      <div class="map" aria-label="Схема ближайших узлов">${oremMapPins(near, point)}<div class="map-badge">АТС / адрес</div><div class="map-controls"><span>+</span><span>-</span><span>${icon("grid")}</span></div><div class="map-city">${esc(getOremGp().territory)}</div></div>
      <div class="table-wrap compact" style="margin-top:12px"><table class="nearest-table"><thead><tr><th>#</th><th>Ближайший узел</th><th>кВ</th><th class="num">км</th><th class="num">Цена</th><th class="num">Δ</th><th>Статус</th><th></th></tr></thead><tbody>${near.map((node, index) => oremNearestNodeRow(node, index)).join("")}</tbody></table></div>
      <div class="notice" style="margin-top:12px">Адресный поиск работает по локальному реестру MVP и не заменяет подтверждение ГТП/узла в АТС. Онлайн-геокодер и официальный справочник ГП подключаются следующим шагом.</div>
    </div>
  </section>`;
}

function oremAddressBindingSummary(binding){
  const o = App.state.orem;
  const status = o.addressLookupUpdatedAt ? `${o.addressLookupStatus} · ${o.addressLookupUpdatedAt}` : o.addressLookupStatus;
  return `<div class="address-binding-grid">
    <div class="binding-card"><span>Статус</span><b>${esc(status)}</b><small>уверенность ${fmtPct(o.addressLookupConfidence || binding.confidence, 0)}</small></div>
    <div class="binding-card"><span>Регион</span><b>${esc(o.addressLookupRegion || binding.rule.region)}</b><small>${esc(binding.point.source)}</small></div>
    <div class="binding-card"><span>ГП</span><b>${esc(binding.gp.name)}</b><small>ИНН ${esc(binding.gp.inn)} · ${esc(binding.gp.zoneCode)}</small></div>
    <div class="binding-card"><span>Узел-кандидат</span><b>${esc(binding.buyer.name)}</b><small>${esc(binding.buyer.nodeId)} · ${fmtNum(binding.buyer.distanceKm, 1)} км</small></div>
  </div>
  <div class="data-strip"><span>координаты: ${fmtNum(binding.point.lat, 6)}, ${fmtNum(binding.point.lon, 6)}</span><span>ГП: ${esc(binding.gp.territory)}</span><span>узел: ${esc(binding.buyer.nodeId)}</span></div>`;
}

function oremMapPins(near, point){
  const all = [{ lat: point.lat, lon: point.lon }, ...near];
  const minLat = Math.min(...all.map((x) => x.lat)) - 0.03;
  const maxLat = Math.max(...all.map((x) => x.lat)) + 0.03;
  const minLon = Math.min(...all.map((x) => x.lon)) - 0.03;
  const maxLon = Math.max(...all.map((x) => x.lon)) + 0.03;
  const x = (lon) => ((lon - minLon) / Math.max(0.0001, maxLon - minLon)) * 84 + 8;
  const y = (lat) => (1 - ((lat - minLat) / Math.max(0.0001, maxLat - minLat))) * 78 + 10;
  const addressX = x(point.lon);
  const addressY = y(point.lat);
  const lines = near.map((node) => {
    const nx = x(node.lon);
    const ny = y(node.lat);
    const dx = nx - addressX;
    const dy = ny - addressY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return `<div class="distance-line" style="left:${addressX}%;top:${addressY}%;width:${len}%;transform:rotate(${angle}deg)"></div>`;
  }).join("");
  const nodes = near.map((node) => `<div class="pin node ${node.status === "unconfirmed" ? "warn" : ""}" style="left:${x(node.lon)}%;top:${y(node.lat)}%"></div><div class="pin-label" style="left:${x(node.lon)}%;top:${y(node.lat)}%">${fmtNum(node.distanceKm, 1)} км</div>`).join("");
  return `${lines}<div class="pin address" style="left:${addressX}%;top:${addressY}%"></div><div class="pin-label" style="left:${addressX}%;top:${addressY}%">объект</div>${nodes}`;
}

function oremNearestNodeRow(node, index){
  const seller = getOremNode(App.state.orem.selectedSellerNodeId);
  const avgNode = mean(node.rsv);
  const avgDiff = mean(node.rsv.map((price, h) => price - num(seller.rsv[h])));
  return `<tr><td>${index + 1}</td><td>${esc(node.name)}<br><span class="muted">${esc(node.nodeId)}</span></td><td>${esc(node.voltage.replace(" кВ", ""))}</td><td class="num">${fmtNum(node.distanceKm, 1)} км</td><td class="num">${fmtNum(avgNode, 2)}</td><td class="num">${fmtNum(avgDiff, 2)}</td><td>${statusBadgeText(node.preferredForAddress ? "address-preferred" : (node.mappingStatus || node.status))}</td><td><button class="row-action" type="button" title="В расчёт" data-click="select-orem-node" data-value="${esc(node.id)}">${icon("link")}</button></td></tr>`;
}

function oremChartPanel(result){
  return `<section class="panel">
    <div class="panel-head"><div><h3>4. Динамика узловых цен</h3><span>РСВ, руб./МВт·ч · ${esc(result.buyer.name)}</span></div></div>
    <div class="panel-body">
      <div class="legend"><span><i class="buyer"></i>Узел сети</span><span><i class="seller"></i>Зона ГП</span><span><i class="diff"></i>Δ РУЦ</span></div>
      <div class="chart-wrap">${oremChartSvg(result)}</div>
      <div class="comparison-grid" style="margin-top:12px">
        ${comparisonCard("Сравнение сценариев", [["Через ГП", result.avgSeller + 280], ["Выбранный узел", result.avgBuyer], ["НЭСК + надбавка", result.avgBuyer + 160]])}
        ${comparisonCard("Риски качества", [["node_id", result.unconfirmed.length ? 62 : 92], ["цены АТС", 88], ["адресный скоринг", 70]], true)}
      </div>
    </div>
  </section>`;
}

function oremChartSvg(result){
  const values = [...result.buyer.rsv, ...result.seller.rsv];
  const min = Math.min(...values) - 120;
  const max = Math.max(...values) + 120;
  const width = 760;
  const height = 220;
  const pad = { l: 42, r: 22, t: 12, b: 32 };
  const x = (i) => pad.l + (i / 23) * (width - pad.l - pad.r);
  const y = (v) => pad.t + (1 - ((v - min) / Math.max(1, max - min))) * (height - pad.t - pad.b);
  const pathFor = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const diffScaled = result.diffs.map((d) => mean(result.seller.rsv) + d);
  const area = `${pathFor(result.buyer.rsv)} L${x(23)},${y(result.seller.rsv[23])} ${result.seller.rsv.map((v, i) => `L${x(23 - i).toFixed(2)},${y(result.seller.rsv[23 - i]).toFixed(2)}`).join(" ")} Z`;
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="График узловых цен">
    <path class="chart-area" d="${area}"></path><path class="chart-axis" d="M${pad.l},${height - pad.b}H${width - pad.r}"></path><path class="chart-axis" d="M${pad.l},${pad.t}V${height - pad.b}"></path>
    <path class="chart-line-seller" d="${pathFor(result.seller.rsv)}"></path><path class="chart-line-buyer" d="${pathFor(result.buyer.rsv)}"></path><path class="chart-line-diff" d="${pathFor(diffScaled)}"></path>
    <text class="chart-label" x="${pad.l}" y="${height - 8}">00:00</text><text class="chart-label" x="${x(8)}" y="${height - 8}">08:00</text><text class="chart-label" x="${x(16)}" y="${height - 8}">16:00</text><text class="chart-label" x="${width - pad.r - 32}" y="${height - 8}">24:00</text>
    <text class="chart-label" x="4" y="${y(max - 120).toFixed(2)}">${fmtNum(max - 120, 0)}</text><text class="chart-label" x="4" y="${y(min + 120).toFixed(2)}">${fmtNum(min + 120, 0)}</text>
  </svg>`;
}

function comparisonCard(title, rows, percentMode = false){
  const max = Math.max(1, ...rows.map(([, value]) => Math.abs(value)));
  return `<div class="scenario-card"><h4>${esc(title)}</h4>${rows.map(([label, value], index) => `<div class="bar-row compact-row"><span>${esc(label)}</span><span class="bar-mini ${value < 0 ? "negative" : index === 0 ? "" : "positive"}"><i style="width:${Math.max(8, Math.abs(value) / max * 100)}%"></i></span><span class="right">${percentMode ? fmtPct(value, 1) : fmtNum(value, 0)}</span></div>`).join("")}</div>`;
}

function oremSideRegistriesPanel(){
  const gpRows = OREM_GP_REGISTRY.slice(0, 5);
  const nodeRows = getOremNodes().slice(0, 5);
  return `<section class="panel side-registry-panel">
    <div class="panel-head"><div><h3>5. Реестры</h3><span>ГП и узлы территории</span></div></div>
    <div class="side-registry">
      <div class="registry-block"><div class="compact-head"><b>Реестр ГП</b><button type="button" class="mini-tab active">Открыть</button></div><div class="compact-search"><span>Поиск по наименованию, ИНН</span>${icon("database")}</div><div class="table-wrap compact"><table><thead><tr><th>ГП</th><th>ИНН</th><th>Зона</th><th></th></tr></thead><tbody>${gpRows.map((item) => `<tr><td>${esc(item.name)}</td><td>${esc(item.inn)}</td><td>${esc(item.zoneCode)}</td><td>${statusBadgeText(item.status)}</td></tr>`).join("")}</tbody></table></div></div>
      <div class="registry-block"><div class="compact-head"><b>Реестр узлов</b><button type="button" class="mini-tab">Открыть</button></div><div class="compact-search"><span>Поиск по наименованию, node_id</span>${icon("database")}</div><div class="table-wrap compact"><table><thead><tr><th>Узел</th><th>node_id</th><th>кВ</th><th></th></tr></thead><tbody>${nodeRows.map((item) => `<tr><td>${esc(item.name)}</td><td>${esc(item.nodeId)}</td><td>${esc(item.voltage)}</td><td>${statusBadgeText(item.mappingStatus || item.status)}</td></tr>`).join("")}</tbody></table></div></div>
    </div>
  </section>`;
}

function oremQualityPanel(result){
  return `<section class="panel">
    <div class="panel-head"><div><h3>6. Качество данных</h3><span>Гейты перед внешним расчётом</span></div></div>
    <div class="panel-body">
      <div class="quality-card-grid">
        <div class="quality-card ok"><b>Актуальность цен АТС</b><strong>${esc(App.state.orem.selectedPeriod)}</strong><span>demo-профиль 24 часа</span></div>
        <div class="quality-card ok"><b>Справочники</b><strong>${OREM_GP_REGISTRY.length} ГП / ${OREM_NODE_REGISTRY.length} узлов</strong><span>локальный реестр MVP</span></div>
        <div class="quality-card warn"><b>Подтверждение node_id</b><strong>${result.unconfirmed.length ? `${result.unconfirmed.length} без подтверждения` : "в норме"}</strong><span>перейти к проверке</span></div>
        <div class="quality-card ok"><b>Полнота данных</b><strong>${fmtPct(result.quality, 1)}</strong><span>${result.quality >= 80 ? "источники в норме" : "нужна сверка"}</span></div>
      </div>
      <div class="notice warn" style="margin-top:12px"><strong>AP-E01:</strong> при загрузке почасовых файлов АТС/СО час N хранится как интервал N-1..N МСК. В импорте нужен явный сдвиг индекса.</div>
    </div>
  </section>`;
}

function renderOremEffect(){
  const economy = calcOrem();
  const tone = economy.periodWholesaleEffectRubKwh >= 0 ? "green" : "red";
  const futureTone = economy.futureWholesaleEffectRubKwh >= 0 ? "green" : "red";
  return `<div class="stack">
    <section class="panel">
      <div class="panel-head"><div><h3>Эффективность выхода на ОРЭМ</h3><span>${esc(App.state.orem.addressText)}</span></div><span class="badge blue">точка Красный Яр</span></div>
      <div class="panel-body">
        <div class="orem-kpis">
          ${effectScenarioCard("Оптовый эффект по текущей СН", "01.01-30.09.2026", economy.currentGpMarkupRubKwh, economy.currentWholesaleEffectRubKwh, economy)}
          ${effectScenarioCard("Оптовый эффект с 01.10", "01.10-31.12.2026", economy.futureGpMarkupRubKwh, economy.futureWholesaleEffectRubKwh, economy)}
          <div class="kpi accent-${economy.nodeEffectRubKwh >= 0 ? "green" : "red"}"><small>Экономия по РУЦ 1 кВт·ч</small><strong class="${economy.nodeEffectRubKwh >= 0 ? "green" : "red"}">${fmtSignedRub(economy.nodeEffectRubKwh, 4)}</strong><span>${fmtNum(economy.gpZoneRubKwh, 4)} - ${fmtNum(economy.nodeRubKwh, 4)} ₽/кВт·ч</span></div>
          <div class="kpi accent-amber"><small>Мощность</small><strong class="${economy.capacity.effectRubKwh >= 0 ? "green" : "red"}">${fmtSignedRub(economy.capacity.effectRubKwh, 4)}</strong><span>РРЭМ ${fmtNum(economy.capacity.retailCapacityMw, 4)} МВт · ОРЭМ ${fmtNum(economy.capacity.pchpnMw, 4)} МВт</span></div>
        </div>
        <div class="notice" style="margin-top:12px"><strong>Логика:</strong> эффект ядра ОРЭМ = экономия по РУЦ + сбытовая надбавка ГП + поправка мощности - инфраструктурные платежи ОРЭМ. При объёме ${fmtNum(economy.volume, 3)} МВт·ч: текущая СН даёт ${fmtSignedRub(economy.currentWholesaleEffectRub, 0)} без НДС; СН с 01.10.2026 - ${fmtSignedRub(economy.futureWholesaleEffectRub, 0)} без НДС.</div>
      </div>
    </section>
    <div class="orem-grid">
      <section class="panel">
        <div class="panel-head"><div><h3>Ядро оптового эффекта</h3><span>РУЦ + СН ГП + мощность - инфраструктура ОРЭМ</span></div></div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="field"><label>Группа сбытовой надбавки ГП</label><select ${updateInput("orem.selectedMarkupGroup")}>${OREM_MARKUP_GROUPS.map((item) => `<option value="${item.id}" ${item.id === App.state.orem.selectedMarkupGroup ? "selected" : ""}>${esc(item.label)}</option>`).join("")}</select></div>
            <div class="field"><label>Период надбавки</label><select ${updateInput("orem.selectedMarkupPeriod")}><option value="janSep" ${App.state.orem.selectedMarkupPeriod === "janSep" ? "selected" : ""}>01.01-30.09.2026</option><option value="octDec" ${App.state.orem.selectedMarkupPeriod === "octDec" ? "selected" : ""}>01.10-31.12.2026</option></select></div>
          </div>
          <div class="component-list">
            ${componentRow("Цена зоны ГП / benchmark РУЦ", economy.gpZoneRubKwh, economy.seller.name)}
            ${componentRow("Цена выбранного узла РУЦ", economy.nodeRubKwh, economy.buyer.name)}
            ${componentRow("Экономия по РУЦ", economy.nodeEffectRubKwh, `${fmtNum(economy.gpZoneRubKwh, 4)} - ${fmtNum(economy.nodeRubKwh, 4)}`, true)}
            ${componentRow("Текущая СН ГП", economy.currentGpMarkupRubKwh, "01.01-30.09.2026")}
            ${componentRow("Будущая СН ГП", economy.futureGpMarkupRubKwh, "01.10-31.12.2026")}
            ${componentRow("Поправка мощности", economy.capacity.effectRubKwh, `РРЭМ ${fmtNum(economy.capacity.retailCapacityMw, 4)} МВт - ОРЭМ ${fmtNum(economy.capacity.pchpnMw, 4)} МВт`, true)}
            ${componentRow("Инфраструктура ОРЭМ", economy.infrastructure.effectRubKwh, `${fmtNum(economy.infrastructure.totalRubMwh, 2)} руб./МВт·ч · СО + АТС-КО + ЦФР`, true)}
            ${componentRow("Итого выбранного периода", economy.periodWholesaleEffectRubKwh, "экономия по РУЦ + СН + мощность - инфраструктура", true)}
            ${componentRow("Коммерческий сценарий с сопровождением", economy.periodNetEffectRubKwh, `минус ${fmtNum(economy.service.totalRubMwh, 2)} руб./МВт·ч`, true)}
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div><h3>Мощность и инфраструктура</h3><span>входы для финансовой оценки</span></div></div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="field"><label>Оплачиваемая мощность РРЭМ, МВт</label><input type="number" step="0.0001" value="${esc(App.state.orem.retailCapacityMw)}" ${updateInput("orem.retailCapacityMw", Number)}></div>
            <div class="field"><label>Ставка РРЭМ, руб./МВт·мес</label><input type="number" step="0.01" value="${esc(App.state.orem.retailCapacityTariff)}" ${updateInput("orem.retailCapacityTariff", Number)}></div>
            <div class="field"><label>Цена мощности ОРЭМ, руб./МВт·мес</label><input type="number" step="0.01" value="${esc(App.state.orem.oremCapacityTariff)}" ${updateInput("orem.oremCapacityTariff", Number)}></div>
            <div class="field"><label>СО ЕЭС, руб./МВт·ч</label><input type="number" step="0.01" value="${esc(App.state.orem.oremInfraSoRubMwh)}" ${updateInput("orem.oremInfraSoRubMwh", Number)}></div>
            <div class="field"><label>АТС-КО, руб./МВт·ч</label><input type="number" step="0.01" value="${esc(App.state.orem.oremInfraAtsRubMwh)}" ${updateInput("orem.oremInfraAtsRubMwh", Number)}></div>
            <div class="field"><label>ЦФР, руб./МВт·ч</label><input type="number" step="0.01" value="${esc(App.state.orem.oremInfraCfrRubMwh)}" ${updateInput("orem.oremInfraCfrRubMwh", Number)}></div>
          </div>
          <div class="comparison-grid" style="margin-top:12px">
            ${comparisonCard("Вклад в эффект, руб./МВт·ч", [["РУЦ", economy.nodeEffectRubKwh * 1000], ["СН сейчас", economy.currentGpMarkupRubKwh * 1000], ["СН Q4", economy.futureGpMarkupRubKwh * 1000], ["Мощность", economy.capacity.effectRubKwh * 1000], ["Инфра ОРЭМ", economy.infrastructure.effectRubKwh * 1000]])}
            ${comparisonCard("Эффект по объёму", [["Сейчас", economy.currentWholesaleEffectRub], ["Q4", economy.futureWholesaleEffectRub], ["Сопровождение", -economy.service.costRub]])}
          </div>
          <div class="notice warn" style="margin-top:12px">Передача и сервисная схема должны считаться отдельной коммерческой моделью после подтверждения схемы участия и договора.</div>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head"><div><h3>Готовность точки</h3><span>адресный shortlist и ограничения расчёта</span></div></div>
      <div class="panel-body"><div class="kpi-grid compact-kpis">
        <div class="kpi"><small>Ближайший узел</small><strong>${fmtNum(nearestOremNodes(1)[0]?.distanceKm, 1)}</strong><span>${esc(nearestOremNodes(1)[0]?.nodeId || "нет данных")} · км</span></div>
        <div class="kpi"><small>Pчпн по Аптайм</small><strong>${fmtNum(economy.capacity.pchpnMw, 4)}</strong><span>МВт</span></div>
        <div class="kpi accent-${tone}"><small>Статус текущего периода</small><strong class="${tone}">${economy.periodWholesaleEffectRubKwh >= 0 ? "положит." : "проверить"}</strong><span>ядро без правового допуска</span></div>
        <div class="kpi accent-${futureTone}"><small>Статус Q4</small><strong class="${futureTone}">${economy.futureWholesaleEffectRubKwh >= 0 ? "положит." : "проверить"}</strong><span>с будущей СН</span></div>
      </div></div>
    </section>
  </div>`;
}

function effectScenarioCard(title, period, markupRubKwh, effectRubKwh, economy){
  const tone = effectRubKwh >= 0 ? "green" : "red";
  return `<div class="kpi effect-kpi accent-${tone}">
    <small>${esc(title)}</small><strong class="${tone}">${fmtSignedRub(effectRubKwh, 4)}</strong><span>${esc(period)} · РУЦ + СН + мощность - инфраструктура</span>
    <div class="effect-breakdown">
      <span>РУЦ: ${fmtNum(economy.gpZoneRubKwh, 4)} - ${fmtNum(economy.nodeRubKwh, 4)} = ${fmtSignedRub(economy.nodeEffectRubKwh, 4)}</span>
      <span>СН ГП: +${fmtNum(markupRubKwh, 5)} руб./кВт·ч</span>
      <span>Мощность: ${fmtSignedRub(economy.capacity.effectRubKwh, 4)}</span>
      <span>Инфраструктура ОРЭМ: ${fmtSignedRub(economy.infrastructure.effectRubKwh, 4)}</span>
    </div>
  </div>`;
}

function componentRow(label, valueRubKwh, note, signed = false){
  const tone = signed ? (valueRubKwh >= 0 ? "green" : "red") : "";
  return `<div class="component-row"><div><b>${esc(label)}</b><span>${esc(note)}</span></div><strong class="${tone}">${signed ? fmtSignedRub(valueRubKwh, 4) : `${fmtNum(valueRubKwh, 4)} ₽/кВт·ч`}</strong></div>`;
}

function renderOremHistory(){
  const hist = App.data.oremHistory;
  const active = App.state.orem.activeHistoryHorizon || "365";
  const src = hist?.summaries?.[active] || hist?.summaries?.["365"];
  if(!src) return `<div class="panel"><div class="panel-head"><h3>История РУЦ</h3><span>JSON не загружен</span></div><div class="panel-body"><div class="empty">История РУЦ пока недоступна</div></div></div>`;
  return `<div class="stack">
    <section class="panel">
      <div class="panel-head"><div><h3>История РУЦ</h3><span>${esc(hist.node?.name || "Узел")} · ${esc(hist.node?.nodeId || "")}</span></div><div class="mini-tabs"><button class="mini-tab ${active === "365" ? "active" : ""}" data-click="set-history-horizon" data-value="365">12 месяцев</button><button class="mini-tab ${active === "730" ? "active" : ""}" data-click="set-history-horizon" data-value="730">24 месяца</button></div></div>
      <div class="panel-body">
        <div class="kpi-grid">
          <div class="kpi"><small>Период истории</small><strong>${fmtNum(src.days, 0)}</strong><span>дней · ${fmtNum(src.hours, 0)} часов</span></div>
          <div class="kpi"><small>Средняя РУЦ узла</small><strong>${fmtNum(src.nodeAvgRubMwh, 2)}</strong><span>руб./МВт·ч</span></div>
          <div class="kpi accent-green"><small>Средний эффект</small><strong class="green">${fmtSignedRub(src.effectRubKwh, 4)}</strong><span>руб./кВт·ч</span></div>
          <div class="kpi"><small>Часы с эффектом</small><strong>${fmtPct(num(src.positiveHoursShare) * 100, 1)}</strong><span>доля покрытия</span></div>
        </div>
        <div class="comparison-grid" style="margin-top:12px">
          ${comparisonCard("Распределение Δ РУЦ, руб./МВт·ч", [["P10", src.p10DeltaRubMwh], ["P50", src.p50DeltaRubMwh], ["P90", src.p90DeltaRubMwh], ["Среднее", src.deltaAvgRubMwh]])}
          ${comparisonCard("Цены узла, руб./МВт·ч", [["Min", src.nodeMinRubMwh], ["P50", src.nodeP50RubMwh], ["P90", src.nodeP90RubMwh], ["Max", src.nodeMaxRubMwh]])}
        </div>
        <div class="note" style="margin-top:14px">${esc(hist.reference?.warning || "История частичная; требуется подтверждение официальной историей зоны ГП/ПУНЦ.")}</div>
      </div>
    </section>
  </div>`;
}

function calcGeneration(){
  const g = App.state.generation;
  const hasBess = g.bessEnabled === "yes";
  const quoteTotals = generationQuoteTotals();
  const useQuotes = g.capexSource === "quotes" && quoteTotals.capexRub > 0;
  const demand = num(g.annualDemandMwh);
  const categoryRows = calcCategories();
  const selectedCategory = categoryRows.find((r) => String(r.ck) === String(g.gridCategory)) || categoryRows.find((r) => r.ck === 4) || categoryRows[0];
  const categoryRubMwh = selectedCategory ? selectedCategory.rateRubKwh * 1000 : num(g.retailRubMwh);
  const benchmarkRubMwh = g.dgUseCategoryBenchmark === "no" ? num(g.retailRubMwh) : categoryRubMwh;
  const tpAnnual = (num(g.tpCostRub) + num(g.connectionCostRub)) / Math.max(1, num(g.tpLifeYears));
  const gridReserve = num(App.state.context.connectedKw) * num(g.gridReserveRubKwYear);
  const gridEnergyCost = demand * benchmarkRubMwh;
  const gridAnnualCost = gridEnergyCost + tpAnnual + gridReserve;
  const pvPotential = num(g.pvKwp) * num(g.pvYieldKwhKwp) / 1000;
  const pvUsed = Math.min(pvPotential * num(g.pvDirectUsePct) / 100, demand);
  const gasPotential = num(g.gasEngineKw) * 8760 * num(g.gasAvailabilityPct) / 100 / 1000;
  const gasUsed = Math.min(gasPotential, Math.max(0, demand - pvUsed));
  const dieselUsed = Math.min(num(g.dieselKw) * 8760 * .35 / 1000, demand * .008, Math.max(0, demand - pvUsed - gasUsed));
  const own = pvUsed + gasUsed + dieselUsed;
  const grid = Math.max(0, demand - own);
  const surplus = Math.max(0, pvPotential - pvUsed);
  const gasEngine = num(g.gasEngineKw) * num(g.gasEngineRubKw);
  const pv = num(g.pvKwp) * num(g.pvRubKwp);
  const bess = hasBess ? num(g.bessPowerKw) * num(g.bessPowerRubKw) + num(g.bessCapacityKwh) * num(g.bessEnergyRubKwh) : 0;
  const diesel = num(g.dieselKw) * num(g.dieselRubKw);
  const manualEquipment = gasEngine + pv + bess + diesel + num(g.gridIntegrationRub) + num(g.emsRub);
  const equipment = useQuotes ? quoteTotals.capexRub : manualEquipment;
  const engineering = equipment * num(g.engineeringPct) / 100;
  const construction = equipment * num(g.constructionPct) / 100;
  const capexBase = equipment + engineering + construction + num(g.ownerCostsRub);
  const contingency = capexBase * num(g.contingencyPct) / 100;
  const capex = capexBase + contingency;
  const gasFuel = gasUsed * num(g.gasConsumptionM3Mwh) * currentGasRub1000() / 1000;
  const variableOm = own * num(g.variableOmRubMwh);
  const fixedOm = capex * num(g.fixedOmPctCapex) / 100;
  const quoteOpex = useQuotes ? quoteTotals.opexRubYear : 0;
  const opex = gasFuel + variableOm + fixedOm + num(g.staffRubYear) + quoteOpex;
  const avoidedRetail = own * benchmarkRubMwh;
  const exportRevenue = surplus * num(g.exportRubMwh);
  const usefulHeatMwh = gasUsed * num(g.heatRecoveryPct) / 100 * num(g.usefulHeatPct) / 100;
  const heatValue = usefulHeatMwh * num(g.heatValueRubMwh);
  const ebitda = avoidedRetail + exportRevenue + heatValue - opex;
  const simplePayback = ebitda > 0 ? capex / ebitda : null;
  const npv = calcNpv(capex, ebitda, num(g.discountRatePct), num(g.horizonYears));
  const lcoe = (capex / Math.max(1, num(g.horizonYears)) + opex) / Math.max(1, own);
  const residualGridCost = grid * benchmarkRubMwh;
  const capexAnnual = capex / Math.max(1, num(g.horizonYears));
  const dgAnnualCost = capexAnnual + opex + residualGridCost;
  const annualCostDelta = gridAnnualCost - dgAnnualCost;
  return { demand, selectedCategory, benchmarkRubMwh, categoryRubMwh, gridEnergyCost, tpAnnual, gridReserve, gridAnnualCost, pvPotential, pvUsed, gasUsed, dieselUsed, own, grid, surplus, capex, capexAnnual, gasFuel, variableOm, fixedOm, quoteOpex, opex, avoidedRetail, exportRevenue, usefulHeatMwh, heatValue, ebitda, simplePayback, npv, lcoe, residualGridCost, dgAnnualCost, annualCostDelta, manualEquipment, equipment, useQuotes, quoteTotals };
}

function calcNpv(capex, annual, ratePct, years){
  const rate = ratePct / 100;
  let total = -capex;
  for(let y = 1; y <= years; y += 1) total += annual / Math.pow(1 + rate, y);
  return total;
}

function renderGeneration(){
  const g = App.state.generation;
  const r = calcGeneration();
  const gasCtx = gasPriceContext(selectedGasRow(), App.state.context.period || puncPeriod(), g.gasRub1000m3);
  const bessEnabled = g.bessEnabled === "yes";
  const quoteTotals = r.quoteTotals;
  const bessFields = bessEnabled ? `
        ${genField("bessPowerKw", "Накопитель, мощность, кВт")}
        ${genField("bessCapacityKwh", "Накопитель, емкость, кВт·ч")}
        ${genField("bessPowerRubKw", "CAPEX накопителя по мощности, руб./кВт")}
        ${genField("bessEnergyRubKwh", "CAPEX накопителя по емкости, руб./кВт·ч")}` : "";
  return `<div class="workspace">
    <div class="panel"><div class="panel-head"><h3>Опросный лист и сетевая база</h3><span>CAPEX / OPEX / ТП</span></div><div class="panel-body">
      <div class="form-grid">
        ${genField("annualDemandMwh", "Спрос, МВт·ч/год")}
        <div class="field"><label>Сетевая категория</label><select ${updateInput("generation.gridCategory", Number)}>${[1,2,3,4,5,6].map((ck) => `<option value="${ck}" ${num(g.gridCategory) === ck ? "selected" : ""}>${ck} ЦК</option>`).join("")}</select></div>
        <div class="field"><label>База сравнения</label><select ${updateInput("generation.dgUseCategoryBenchmark")}><option value="yes" ${g.dgUseCategoryBenchmark !== "no" ? "selected" : ""}>по выбранной ЦК</option><option value="no" ${g.dgUseCategoryBenchmark === "no" ? "selected" : ""}>ручная РРЭ</option></select></div>
        ${genField("retailRubMwh", "Ручная РРЭ, руб./МВт·ч")}
        ${genField("tpCostRub", "ТП / техприсоединение, руб.")}
        ${genField("connectionCostRub", "Доп. присоединение, руб.")}
        ${genField("tpLifeYears", "Срок учета ТП, лет")}
        ${genField("gridReserveRubKwYear", "Резерв сети, руб./кВт·год")}
        ${genField("gasEngineKw", "ГПУ, кВт")}
        ${genField("gasAvailabilityPct", "Доступность ГПУ, %")}
        ${genField("pvKwp", "СЭС, кВтп")}
        <div class="field"><label>Накопитель</label><select ${updateInput("generation.bessEnabled")}><option value="no" ${!bessEnabled ? "selected" : ""}>не учитывать</option><option value="yes" ${bessEnabled ? "selected" : ""}>учитывать сценарно</option></select></div>
        ${genField("gasEngineRubKw", "CAPEX ГПУ, руб./кВт")}
        ${genField("pvRubKwp", "CAPEX СЭС, руб./кВтп")}
        ${bessFields}
        ${genField("gasConsumptionM3Mwh", "Газ, м3/МВт·ч")}
        ${genField("variableOmRubMwh", "Перем. ТОиР, руб./МВт·ч")}
        ${genField("heatRecoveryPct", "Тепло от ГПУ, %")}
        ${genField("usefulHeatPct", "Полезное тепло, %")}
        ${genField("heatValueRubMwh", "Ценность тепла, руб./МВт·ч")}
        ${genField("discountRatePct", "Дисконт, %")}
      </div>
      <div class="upload-grid" style="margin-top:12px">
        <label class="upload-box">
          <span>КП поставщиков оборудования</span>
          <strong>${esc(g.quoteFileName || "загрузить Excel/CSV с составом оборудования")}</strong>
          <input type="file" data-file="equipment-quotes" accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.json,.txt">
        </label>
      </div>
      <div class="form-grid one" style="margin-top:12px">
        <div class="field"><label>Источник CAPEX</label><select ${updateInput("generation.capexSource")}><option value="manual" ${g.capexSource !== "quotes" ? "selected" : ""}>ручные ставки</option><option value="quotes" ${g.capexSource === "quotes" ? "selected" : ""}>КП поставщиков</option></select></div>
      </div>
      <div class="banner info" style="margin-top:12px">${esc(g.quoteStatus)} · ${r.useQuotes ? "CAPEX/OPEX взяты из КП" : "расчет по ручным ставкам"}</div>
    </div></div>
    <div>
      <div class="kpi-grid">
        <div class="kpi"><small>Сеть, год</small><strong>${fmtMln(r.gridAnnualCost)}</strong><span>${r.selectedCategory?.ck || g.gridCategory} ЦК · ${fmtNum(r.benchmarkRubMwh, 0)} руб./МВт·ч</span></div>
        <div class="kpi"><small>ДГ + остаточная сеть</small><strong>${fmtMln(r.dgAnnualCost)}</strong><span>OPEX + CAPEX/${fmtNum(g.horizonYears)} лет</span></div>
        <div class="kpi ${r.annualCostDelta >= 0 ? "accent-green" : "accent-red"}"><small>Годовой +/-</small><strong class="${r.annualCostDelta >= 0 ? "green" : "red"}">${fmtMln(r.annualCostDelta)}</strong><span>сравнение полной стоимости</span></div>
        <div class="kpi"><small>NPV</small><strong>${fmtMln(r.npv)}</strong><span>EBITDA-модель · ${fmtNum(g.horizonYears)} лет</span></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>Газовая база генерации</h3><span>${esc(App.state.context.region)} · ${esc(App.state.info.gasGroup)}</span></div><div class="panel-body">
        <div class="status-grid">
          ${availabilityCard({ title: "Цена топлива", status: gasCtx.status === "loaded" || gasCtx.status === "computed" ? "loaded" : "draft", value: `${fmtNum(gasCtx.valueRub1000, 0)} ₽/1000 м3`, detail: gasPriceStatusLabel(gasCtx.status) })}
          ${availabilityCard({ title: "Компоненты газа", status: gasCtx.components.complete ? "loaded" : "draft", value: `${fmtNum(gasCtx.components.present)}/${fmtNum(gasCtx.components.total)}`, detail: gasCtx.row?.gro || "ГРО не выбрана" })}
          ${availabilityCard({ title: "Топливный OPEX", status: gasCtx.status === "manual-fallback" ? "draft" : "loaded", value: fmtMln(r.gasFuel), detail: `${fmtNum(g.gasConsumptionM3Mwh)} м3/МВт·ч` })}
        </div>
        ${gasCtx.warning ? `<div class="banner warn" style="margin-top:12px">${esc(gasCtx.warning)}</div>` : ""}
      </div></div>
      <div class="split" style="margin-top:14px">
        <div class="panel"><div class="panel-head"><h3>Сеть vs собственная генерация</h3><span>руб./год</span></div><div class="panel-body">${generationComparisonTable(r)}</div></div>
        <div class="panel"><div class="panel-head"><h3>Баланс энергии</h3><span>МВт·ч/год</span></div><div class="panel-body">
          <div class="chart">
            ${bar("ГПУ", r.gasUsed / Math.max(1, r.demand) * 100, "green")}
            ${bar("СЭС", r.pvUsed / Math.max(1, r.demand) * 100)}
            ${bar("ДГУ", r.dieselUsed / Math.max(1, r.demand) * 100, "amber")}
            ${bar("Сеть", r.grid / Math.max(1, r.demand) * 100, "red")}
          </div>
        </div></div>
      </div>
      <div class="split" style="margin-top:14px">
        <div class="panel"><div class="panel-head"><h3>Укрупненная ФЭМ</h3><span>${fmtNum(g.horizonYears)} лет</span></div><div class="panel-body">${generationFinancialTable(r)}</div></div>
        <div class="panel"><div class="panel-head"><h3>Когенерация</h3><span>использование тепла</span></div><div class="panel-body">
          <div class="table-wrap"><table class="kv-table"><thead><tr><th>Показатель</th><th class="num">Значение</th></tr></thead><tbody>
            <tr><td>Полезное тепло</td><td class="num">${fmtNum(r.usefulHeatMwh, 0)} МВт·ч/год</td></tr>
            <tr><td>Денежный эффект тепла</td><td class="num">${fmtMln(r.heatValue)}</td></tr>
            <tr><td>OPEX</td><td class="num">${fmtMln(r.opex)}</td></tr>
            <tr><td>Простая окупаемость</td><td class="num">${r.simplePayback ? fmtNum(r.simplePayback, 1) + " лет" : "нет"}</td></tr>
          </tbody></table></div>
        </div></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>КП поставщиков</h3><span>${fmtNum(quoteTotals.items.length)} поз. · ${fmtMln(quoteTotals.capexRub)}</span></div><div class="panel-body">${generationQuoteTable(quoteTotals.items)}</div></div>
      <div class="note" style="margin-top:14px">Укрупненная модель сравнивает стоимость сетевого энергоснабжения по выбранной ЦК с собственной генерацией, остаточной покупкой из сети и ежегодным учетом ТП. Для финальной версии расчетное ядро надо закрепить на Decimal и официальных выгрузках.</div>
    </div>
  </div>`;
}

function generationComparisonTable(r){
  return `<div class="table-wrap"><table class="kv-table"><thead><tr><th>Показатель</th><th class="num">Значение</th></tr></thead><tbody>
    <tr><td>Сетевая энергия</td><td class="num">${fmtMln(r.gridEnergyCost)}</td></tr>
    <tr><td>ТП / техприсоединение, годовая доля</td><td class="num">${fmtMln(r.tpAnnual)}</td></tr>
    <tr><td>Резерв сети</td><td class="num">${fmtMln(r.gridReserve)}</td></tr>
    <tr><td><b>Итого сеть</b></td><td class="num"><b>${fmtMln(r.gridAnnualCost)}</b></td></tr>
    <tr><td>OPEX собственной генерации</td><td class="num">${fmtMln(r.opex)}</td></tr>
    <tr><td>OPEX по КП поставщиков</td><td class="num">${fmtMln(r.quoteOpex)}</td></tr>
    <tr><td>CAPEX / срок модели</td><td class="num">${fmtMln(r.capexAnnual)}</td></tr>
    <tr><td>Остаточная покупка из сети</td><td class="num">${fmtMln(r.residualGridCost)}</td></tr>
    <tr><td><b>Итого ДГ + сеть</b></td><td class="num"><b>${fmtMln(r.dgAnnualCost)}</b></td></tr>
    <tr><td><b>Экономия / перерасход</b></td><td class="num ${r.annualCostDelta >= 0 ? "green" : "red"}"><b>${fmtMln(r.annualCostDelta)}</b></td></tr>
  </tbody></table></div>`;
}

function generationFinancialTable(r){
  return `<div class="table-wrap"><table class="kv-table"><thead><tr><th>Метрика</th><th class="num">Значение</th></tr></thead><tbody>
    <tr><td>CAPEX проекта</td><td class="num">${fmtMln(r.capex)}</td></tr>
    <tr><td>Источник CAPEX</td><td class="num">${r.useQuotes ? "КП поставщиков" : "ручные ставки"}</td></tr>
    <tr><td>LCOE собственной генерации</td><td class="num">${fmtNum(r.lcoe, 0)} руб./МВт·ч</td></tr>
    <tr><td>Выручка/избежанные затраты от замещения сети</td><td class="num">${fmtMln(r.avoidedRetail)}</td></tr>
    <tr><td>Экспорт излишков</td><td class="num">${fmtMln(r.exportRevenue)}</td></tr>
    <tr><td>OPEX</td><td class="num">${fmtMln(r.opex)}</td></tr>
    <tr><td>EBITDA-эффект</td><td class="num">${fmtMln(r.ebitda)}</td></tr>
    <tr><td>NPV</td><td class="num">${fmtMln(r.npv)}</td></tr>
    <tr><td>Простая окупаемость</td><td class="num">${r.simplePayback ? fmtNum(r.simplePayback, 1) + " лет" : "нет"}</td></tr>
  </tbody></table></div>`;
}

function generationQuoteTable(items){
  if(!items.length) return `<div class="empty">КП не загружены. Можно загрузить Excel/CSV с колонками: оборудование, поставщик, модель, мощность кВт, емкость кВт·ч, CAPEX руб., OPEX руб./год.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Тип</th><th>Поставщик</th><th>Модель</th><th class="num">кВт</th><th class="num">кВт·ч</th><th class="num">CAPEX</th><th class="num">OPEX/год</th></tr></thead><tbody>
    ${items.map((item) => `<tr><td>${esc(quoteTypeLabel(item.type))}</td><td>${esc(item.supplier)}</td><td>${esc(item.model)}</td><td class="num">${fmtNum(item.powerKw, 0)}</td><td class="num">${fmtNum(item.capacityKwh, 0)}</td><td class="num">${fmtMln(item.capexRub)}</td><td class="num">${fmtMln(item.opexRubYear)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function genField(key, label){
  return `<div class="field"><label>${esc(label)}</label><input type="number" value="${esc(App.state.generation[key])}" ${updateInput(`generation.${key}`, Number)}></div>`;
}

function calcSummary(){
  const ck4 = calcCategories().find((r) => r.ck === 4);
  const orem = calcOrem();
  const dg = calcGeneration();
  return { ck4Total: ck4?.total || 0, ck4Rate: ck4?.rateRubKwh || 0, oremEffect: orem.periodWholesaleEffectRub || 0, dgCapex: dg.capex };
}

function handleAction(action, value){
  if(action === "prepare-region"){
    applyRegionSelection(App.state.context.region);
    saveState();
    render();
    return;
  }
  if(action === "go-punc"){
    App.state.view = "punc";
    saveState();
    render();
    return;
  }
  if(action === "load-punc-bundle"){
    loadPuncBundleForSelectedGp().then(() => render()).catch((err) => {
      App.state.punc.bundleStatus = `Ошибка загрузки ПУНЦ: ${err.message}`;
      saveState();
      render();
    });
    return;
  }
  if(action === "updatePunc"){
    syncPuncGpWithRegion();
    App.state.punc.lastUpdate = new Date().toLocaleString("ru-RU");
    App.state.context.period = puncPeriod();
    App.state.uptime.period = puncPeriod();
    saveState();
    loadCk4Period(puncPeriod()).then(() => render()).catch(() => render());
    return;
  }
  if(action === "punc-search"){
    syncPuncGpWithRegion();
    App.state.punc.searchStatus = "поиск подготовлен";
    App.state.punc.lastSearch = {
      when: new Date().toLocaleString("ru-RU"),
      site: App.state.punc.gpSite || "сайт не указан",
      period: puncPeriod(),
      category: App.state.punc.priceCategory === "all" ? "все ЦК" : `${App.state.punc.priceCategory} ЦК`,
      query: puncSearchQuery(),
    };
    saveState();
    render();
  }
  if(action === "set-uptime-mode"){
    App.state.uptime.mode = value || "full";
    saveState();
    render();
  }
  if(action === "toggle-uptime-hour"){
    const [kind, rawHour] = String(value || "").split(":");
    const hour = Number(rawHour);
    if(Number.isInteger(hour) && hour >= 0 && hour <= 23){
      const key = kind === "nonworking" ? "customNonworkingHours" : "customWorkdayHours";
      const set = new Set(cleanHours(App.state.uptime[key], []));
      if(set.has(hour)) set.delete(hour);
      else set.add(hour);
      App.state.uptime[key] = Array.from(set).sort((a, b) => a - b);
      App.state.uptime.mode = "custom";
      saveState();
      render();
    }
  }
  if(action === "set-orem-tab"){
    App.state.orem.tab = value || "calc";
    saveState();
    render();
  }
  if(action === "select-orem-node"){
    App.state.orem.selectedBuyerNodeId = value;
    App.state.orem.tab = "calc";
    saveState();
    render();
  }
  if(action === "orem-bind-address"){
    const binding = buildOremAddressBinding();
    App.state.orem.selectedGpId = binding.gp.id;
    App.state.orem.selectedBuyerNodeId = binding.buyer.id;
    App.state.orem.selectedSellerNodeId = binding.seller.id;
    App.state.orem.coordinates = `${binding.point.lat.toFixed(7)}, ${binding.point.lon.toFixed(7)}`;
    App.state.orem.addressLookupStatus = "адрес привязан";
    App.state.orem.addressLookupUpdatedAt = new Date().toLocaleString("ru-RU");
    App.state.orem.addressLookupConfidence = binding.confidence;
    App.state.orem.addressLookupRegion = binding.rule.region;
    App.state.context.region = binding.rule.region;
    App.state.context.gp = binding.gp.name;
    App.state.punc.selectedGp = binding.gp.name;
    App.state.punc.priceZone = String(priceZoneForRegion(binding.rule.region, binding.gp.name));
    saveState();
    render();
  }
  if(action === "orem-preset-krasny-yar"){
    App.state.orem.selectedGpId = OREM_ADDRESS_PRESET.gpId;
    App.state.orem.selectedBuyerNodeId = "node-zavodskaya-110";
    App.state.orem.selectedSellerNodeId = "node-kes-zone";
    App.state.orem.addressText = `${OREM_ADDRESS_PRESET.name}, ${OREM_ADDRESS_PRESET.address}`;
    App.state.orem.coordinates = `${OREM_ADDRESS_PRESET.lat}, ${OREM_ADDRESS_PRESET.lon}`;
    App.state.orem.addressLookupStatus = "адрес привязан";
    App.state.orem.addressLookupUpdatedAt = new Date().toLocaleString("ru-RU");
    App.state.orem.addressLookupConfidence = 88;
    App.state.orem.addressLookupRegion = "Красноярский край";
    saveState();
    render();
  }
  if(action === "set-history-horizon"){
    App.state.orem.activeHistoryHorizon = value || "365";
    App.state.orem.tab = "history";
    saveState();
    render();
  }
}

async function boot(){
  try {
    const res = await fetch(SOURCE_MODULES.oremData);
    if(res.ok) App.data.oremHistory = await res.json();
  } catch {
    App.data.oremHistory = null;
  }
  syncPuncGpWithRegion();
  App.state.punc.priceZone = String(priceZoneForRegion(App.state.context.region, App.state.punc.selectedGp || App.state.context.gp));
  await loadCk4Period(App.state.uptime.period || App.state.context.period || "2026-04");
  const gas = selectedGasRow();
  if(gas) App.state.generation.gasRub1000m3 = currentGasRub1000();
  render();
}

boot();
