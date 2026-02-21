// ===== 標準報酬月額テーブル（50等級）[標準報酬月額, 下限, 上限] =====
const REMUNERATION_TABLE: [number, number, number][] = [
  [58000, 0, 63000], [68000, 63000, 73000], [78000, 73000, 83000],
  [88000, 83000, 93000], [98000, 93000, 101000], [104000, 101000, 107000],
  [110000, 107000, 114000], [118000, 114000, 122000], [126000, 122000, 130000],
  [134000, 130000, 138000], [142000, 138000, 146000], [150000, 146000, 155000],
  [160000, 155000, 165000], [170000, 165000, 175000], [180000, 175000, 185000],
  [190000, 185000, 195000], [200000, 195000, 210000], [220000, 210000, 230000],
  [240000, 230000, 250000], [260000, 250000, 270000], [280000, 270000, 290000],
  [300000, 290000, 310000], [320000, 310000, 330000], [340000, 330000, 350000],
  [360000, 350000, 370000], [380000, 370000, 395000], [410000, 395000, 425000],
  [440000, 425000, 455000], [470000, 455000, 485000], [500000, 485000, 515000],
  [530000, 515000, 545000], [560000, 545000, 575000], [590000, 575000, 605000],
  [620000, 605000, 635000], [650000, 635000, 665000], [680000, 665000, 695000],
  [710000, 695000, 730000], [750000, 730000, 770000], [790000, 770000, 810000],
  [830000, 810000, 855000], [880000, 855000, 905000], [930000, 905000, 955000],
  [980000, 955000, 1005000], [1030000, 1005000, 1055000], [1090000, 1055000, 1115000],
  [1150000, 1115000, 1175000], [1210000, 1175000, 1235000], [1270000, 1235000, 1295000],
  [1330000, 1295000, 1355000], [1390000, 1355000, Infinity],
];

// ===== 定数 =====
const PENSION_RATE_HALF = 0.0915;
const PENSION_CAP_MONTHLY = 650000;
const HEALTH_CAP_MONTHLY = 1390000;
const EMPLOYMENT_RATE = 0.006;
const HEALTH_BONUS_CAP = 5730000;
const PENSION_BONUS_CAP_PER = 1500000;
const RESIDENT_TAX_RATE = 0.1;
const RESIDENT_TAX_FLAT = 5000;
const RESIDENT_TAX_BASIC_DEDUCTION = 430000;

const FIXED_HEALTH_RATE = 0.099;
const REDUCTION_RATIO = 0.8;

// ===== 標準報酬月額 lookup =====
function lookupStandardMonthly(salary: number): number {
  if (salary <= 0) return REMUNERATION_TABLE[0][0];
  for (let i = 0; i < REMUNERATION_TABLE.length; i++) {
    const entry = REMUNERATION_TABLE[i];
    if (salary >= entry[1] && salary < entry[2]) return entry[0];
  }
  return REMUNERATION_TABLE[REMUNERATION_TABLE.length - 1][0];
}

// ===== 給与所得控除（令和7年） =====
function calcSalaryDeduction(annualIncome: number): number {
  if (annualIncome <= 1900000) return 650000;
  if (annualIncome <= 3600000) return annualIncome * 0.3 + 80000;
  if (annualIncome <= 6600000) return annualIncome * 0.2 + 440000;
  if (annualIncome <= 8500000) return annualIncome * 0.1 + 1100000;
  return 1950000;
}

// ===== 基礎控除 所得税（令和7-8年特例） =====
function calcBasicDeductionIncomeTax(earnedIncome: number): number {
  if (earnedIncome <= 1320000) return 950000;
  if (earnedIncome <= 3360000) return 880000;
  if (earnedIncome <= 4890000) return 680000;
  if (earnedIncome <= 6550000) return 630000;
  if (earnedIncome <= 23500000) return 580000;
  if (earnedIncome <= 24000000) return 480000;
  if (earnedIncome <= 24500000) return 320000;
  if (earnedIncome <= 25000000) return 160000;
  return 0;
}

// ===== 所得税率 =====
function calcIncomeTaxBracket(taxableIncome: number): { rate: number; deduction: number } {
  if (taxableIncome <= 1949000) return { rate: 0.05, deduction: 0 };
  if (taxableIncome <= 3299000) return { rate: 0.10, deduction: 97500 };
  if (taxableIncome <= 6949000) return { rate: 0.20, deduction: 427500 };
  if (taxableIncome <= 8999000) return { rate: 0.23, deduction: 636000 };
  if (taxableIncome <= 17999000) return { rate: 0.33, deduction: 1536000 };
  if (taxableIncome <= 39999000) return { rate: 0.40, deduction: 2796000 };
  return { rate: 0.45, deduction: 4796000 };
}

// ===== シナリオ計算 =====
interface ScenarioResult {
  effectiveMonthly: number;
  annualIncome: number;
  stdMonthly: number;
  totalSI: number;
  residentTax: number;
  incomeTax: number;
  totalDeductions: number;
  housingCost: number;
  netAnnual: number;
  realNetAnnual: number;
  netMonthly: number;
  realNetMonthly: number;
}

function calcScenario(
  monthlySalary: number,
  rent: number,
  reductionRatio: number,
  healthRate: number
): ScenarioResult {
  const effectiveMonthly = monthlySalary - rent * reductionRatio;
  const bonus = monthlySalary;
  const bonusFreq = 1;
  const annualIncome = effectiveMonthly * 12 + bonus * bonusFreq;

  // --- 社会保険料（月額） ---
  const stdMonthly = lookupStandardMonthly(effectiveMonthly);
  const healthStd = Math.min(stdMonthly, HEALTH_CAP_MONTHLY);
  const healthMonthly = healthStd * healthRate * 0.5;
  const pensionStd = Math.min(stdMonthly, PENSION_CAP_MONTHLY);
  const pensionMonthly = pensionStd * PENSION_RATE_HALF;
  const employmentMonthly = effectiveMonthly * EMPLOYMENT_RATE;
  const siMonthly = healthMonthly + pensionMonthly + employmentMonthly;

  // --- 社会保険料（賞与） ---
  const totalBonus = bonus * bonusFreq;
  const healthBonusBase = Math.min(totalBonus, HEALTH_BONUS_CAP);
  const healthBonus = healthBonusBase * healthRate * 0.5;
  const pensionBonusBase =
    totalBonus / bonusFreq >= PENSION_BONUS_CAP_PER
      ? PENSION_BONUS_CAP_PER * bonusFreq
      : totalBonus;
  const pensionBonus = pensionBonusBase * PENSION_RATE_HALF;
  const employmentBonus = totalBonus * EMPLOYMENT_RATE;
  const siBonus = healthBonus + pensionBonus + employmentBonus;
  const totalSI = siMonthly * 12 + siBonus;

  // --- 給与所得 ---
  const salaryDeduction = calcSalaryDeduction(annualIncome);
  const earnedIncome = annualIncome - salaryDeduction;

  // --- 住民税 ---
  const taxableResident = Math.max(0, earnedIncome - totalSI - RESIDENT_TAX_BASIC_DEDUCTION);
  const residentTax = Math.round(taxableResident * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT);

  // --- 所得税 ---
  const basicDeductionIT = calcBasicDeductionIncomeTax(earnedIncome);
  const taxableIT = Math.max(0, earnedIncome - totalSI - basicDeductionIT);
  const bracket = calcIncomeTaxBracket(taxableIT);
  const incomeTax = Math.max(0, taxableIT * bracket.rate - bracket.deduction);

  // --- 合計 ---
  const totalDeductions = totalSI + residentTax + incomeTax;
  const housingCost = (1 - reductionRatio) * rent * 12;
  const netAnnual = annualIncome - totalDeductions;
  const realNetAnnual = netAnnual - housingCost;

  return {
    effectiveMonthly,
    annualIncome,
    stdMonthly,
    totalSI,
    residentTax,
    incomeTax,
    totalDeductions,
    housingCost,
    netAnnual,
    realNetAnnual,
    netMonthly: netAnnual / 12,
    realNetMonthly: realNetAnnual / 12,
  };
}

// ===== LP用シミュレーション =====
export interface SimulationInput {
  monthlySalary: number; // 月給（円）
  headcount: number; // 利用人数
}

export interface SimulationOutput {
  perPerson: {
    takeHomeIncreaseMonthly: number; // 従業員手取り増加額/月
    takeHomeIncreaseAnnual: number; // 従業員手取り増加額/年
    siSavingsMonthly: number; // 会社側社保削減額/月
    siSavingsAnnual: number; // 会社側社保削減額/年
  };
  total: {
    takeHomeIncreaseMonthly: number;
    takeHomeIncreaseAnnual: number;
    siSavingsMonthly: number;
    siSavingsAnnual: number;
  };
  headcount: number;
}

export function simulateLP(input: SimulationInput): SimulationOutput {
  const { monthlySalary, headcount } = input;

  // 家賃: 月給 × 25%（端数万円に丸め）
  const rent = Math.round((monthlySalary * 0.25) / 10000) * 10000;

  const without = calcScenario(monthlySalary, rent, 0.0, FIXED_HEALTH_RATE);
  const withSystem = calcScenario(monthlySalary, rent, REDUCTION_RATIO, FIXED_HEALTH_RATE);

  // 従業員手取り増加額
  const takeHomeIncreaseMonthly = Math.round(withSystem.realNetMonthly - without.realNetMonthly);
  const takeHomeIncreaseAnnual = takeHomeIncreaseMonthly * 12;

  // 会社側社保削減額 = 従業員側SI差額と同額（会社も半額負担のため）
  const employeeSIDiff = Math.round(without.totalSI - withSystem.totalSI);
  const siSavingsAnnual = employeeSIDiff;
  const siSavingsMonthly = Math.round(siSavingsAnnual / 12);

  return {
    perPerson: {
      takeHomeIncreaseMonthly,
      takeHomeIncreaseAnnual,
      siSavingsMonthly,
      siSavingsAnnual,
    },
    total: {
      takeHomeIncreaseMonthly: takeHomeIncreaseMonthly * headcount,
      takeHomeIncreaseAnnual: takeHomeIncreaseAnnual * headcount,
      siSavingsMonthly: siSavingsMonthly * headcount,
      siSavingsAnnual: siSavingsAnnual * headcount,
    },
    headcount,
  };
}

// ===== ユーティリティ =====
export function formatYen(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

export function formatMan(n: number): string {
  return (Math.round((n / 10000) * 10) / 10).toFixed(1);
}

// ===== 月給選択肢 =====
export const SALARY_OPTIONS = [
  { value: 250000, label: "25万円" },
  { value: 300000, label: "30万円" },
  { value: 350000, label: "35万円" },
  { value: 400000, label: "40万円" },
  { value: 450000, label: "45万円" },
  { value: 500000, label: "50万円" },
  { value: 550000, label: "55万円" },
  { value: 600000, label: "60万円" },
  { value: 650000, label: "65万円" },
  { value: 700000, label: "70万円" },
  { value: 750000, label: "75万円" },
  { value: 800000, label: "80万円" },
  { value: 850000, label: "85万円" },
  { value: 900000, label: "90万円" },
  { value: 950000, label: "95万円" },
  { value: 1000000, label: "100万円" },
];
