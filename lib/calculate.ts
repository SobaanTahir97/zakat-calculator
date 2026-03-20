/**
 * Zakat calculation engine
 * Based on MVP rules: https://docs.zakat-calculator.local/CALC_RULES.md
 */

import type { Currency } from './goldRate';

export type WeightUnit = 'gram' | 'tola';

const GRAMS_PER_TOLA = 11.6638;

export type IrrigationType = 'irrigated' | 'rain-fed';
export type Methodology = 'standard' | 'ghamidi' | 'contemporary';

export interface ZakatInput {
  cash: number;
  goldWeight: number;
  goldPricePerUnit: number;
  silverWeight: number;
  silverPricePerUnit: number;
  stocks: number;
  receivables: number;
  debt: number;
  nisabType: 'gold' | 'silver';
  methodology?: Methodology;
  weightUnit?: WeightUnit;
  // Ghamidi-specific
  agriculturalProduce?: number;
  irrigationType?: IrrigationType;
  rentalIncome?: number;
  // Contemporary-specific
  professionalIncome?: number;
  businessInventory?: number;
  // Shafi'i ruling: debts do not reduce zakatable wealth
  deductDebts?: boolean;
}

export interface GhamidiBreakdown {
  wealthZakat: number;
  agriculturalProduce: number;
  agriculturalUshr: number;
  totalCombined: number;
}

export interface ContemporaryBreakdown {
  wealthZakat: number;
  professionalIncome: number;
  businessInventory: number;
}

export interface ZakatResult {
  totalWealthBeforeDebt: number;
  netWealth: number;
  nisabThreshold: number;
  zakatable: boolean;
  zakatDue: number;
  debtDeducted: boolean;
  breakdown: {
    cash: number;
    goldWeight: number;
    goldValue: number;
    silverWeight: number;
    silverValue: number;
    stocks: number;
    receivables: number;
    rentalIncome?: number;
    professionalIncome?: number;
    businessInventory?: number;
  };
  ghamidiBreakdown?: GhamidiBreakdown;
  contemporaryBreakdown?: ContemporaryBreakdown;
}

/**
 * Convert a price-per-unit to price-per-gram based on weight unit.
 */
function toPerGram(pricePerUnit: number, weightUnit: WeightUnit): number {
  return weightUnit === 'tola' ? pricePerUnit / GRAMS_PER_TOLA : pricePerUnit;
}

/**
 * Convert a weight to grams based on weight unit.
 */
function toGrams(weight: number, weightUnit: WeightUnit): number {
  return weightUnit === 'tola' ? weight * GRAMS_PER_TOLA : weight;
}

/**
 * Calculate Nisab threshold based on selected standard.
 * Gold: 85g × gold-price-per-gram
 * Silver: 595g × silver-price-per-gram
 */
function calculateNisab(
  nisabType: 'gold' | 'silver',
  goldPricePerUnit: number,
  silverPricePerUnit: number,
  weightUnit: WeightUnit = 'gram',
): number {
  const goldWeight = 85; // grams
  const silverWeight = 595; // grams

  if (nisabType === 'gold') {
    return goldWeight * toPerGram(goldPricePerUnit, weightUnit);
  }
  return silverWeight * toPerGram(silverPricePerUnit, weightUnit);
}

/**
 * Main zakat calculation function
 * Returns detailed result with breakdown
 */
export function calculateZakat(input: ZakatInput): ZakatResult {
  // Validate inputs
  const cash = Math.max(0, input.cash);
  const goldWeight = Math.max(0, input.goldWeight);
  const goldPricePerUnit = Math.max(0, input.goldPricePerUnit);
  const silverWeight = Math.max(0, input.silverWeight);
  const silverPricePerUnit = Math.max(0, input.silverPricePerUnit);
  const stocks = Math.max(0, input.stocks);
  const receivables = Math.max(0, input.receivables);
  const debt = Math.max(0, input.debt);
  const weightUnit = input.weightUnit ?? 'gram';

  // Calculate metal values: weight × price-per-gram
  const goldPricePerGram = toPerGram(goldPricePerUnit, weightUnit);
  const silverPricePerGram = toPerGram(silverPricePerUnit, weightUnit);
  const goldWeightInGrams = toGrams(goldWeight, weightUnit);
  const silverWeightInGrams = toGrams(silverWeight, weightUnit);
  const goldValue = Math.round(goldWeightInGrams * goldPricePerGram * 100) / 100;
  const silverValue = Math.round(silverWeightInGrams * silverPricePerGram * 100) / 100;

  const methodology = input.methodology ?? 'standard';
  const isGhamidi = methodology === 'ghamidi';
  const isContemporary = methodology === 'contemporary';
  const deductDebts = input.deductDebts !== false; // default true; false = Shafi'i ruling

  // Ghamidi-specific inputs
  const rentalIncome = isGhamidi ? Math.max(0, input.rentalIncome ?? 0) : 0;
  const agriculturalProduce = isGhamidi ? Math.max(0, input.agriculturalProduce ?? 0) : 0;
  const irrigationType = input.irrigationType ?? 'irrigated';

  // Contemporary-specific inputs
  const professionalIncome = isContemporary ? Math.max(0, input.professionalIncome ?? 0) : 0;
  const businessInventory = isContemporary ? Math.max(0, input.businessInventory ?? 0) : 0;

  // Calculate total wealth before debt deduction
  const totalWealthBeforeDebt =
    cash + goldValue + silverValue + stocks + receivables +
    rentalIncome + professionalIncome + businessInventory;

  // Deduct short-term debts (Shafi'i ruling: deductDebts === false skips this)
  const netWealth = deductDebts ? Math.max(0, totalWealthBeforeDebt - debt) : totalWealthBeforeDebt;

  // Calculate nisab threshold
  const nisabThreshold = calculateNisab(input.nisabType, goldPricePerUnit, silverPricePerUnit, weightUnit);

  // Determine if zakat is due
  const zakatable = netWealth >= nisabThreshold;

  // Calculate zakat due (2.5% of net wealth if above nisab, otherwise 0)
  const zakatDue = zakatable ? netWealth * 0.025 : 0;
  const roundedZakatDue = Math.round(zakatDue * 100) / 100;

  // Ghamidi: agricultural ushr is separate (no nisab, 5% irrigated / 10% rain-fed)
  let ghamidiBreakdown: GhamidiBreakdown | undefined;
  if (isGhamidi) {
    const ushrRate = irrigationType === 'rain-fed' ? 0.10 : 0.05;
    const agriculturalUshr = Math.round(agriculturalProduce * ushrRate * 100) / 100;
    ghamidiBreakdown = {
      wealthZakat: roundedZakatDue,
      agriculturalProduce,
      agriculturalUshr,
      totalCombined: roundedZakatDue + agriculturalUshr,
    };
  }

  // Contemporary: breakdown for display purposes
  let contemporaryBreakdown: ContemporaryBreakdown | undefined;
  if (isContemporary) {
    contemporaryBreakdown = {
      wealthZakat: roundedZakatDue,
      professionalIncome,
      businessInventory,
    };
  }

  return {
    totalWealthBeforeDebt,
    netWealth,
    nisabThreshold,
    zakatable,
    zakatDue: roundedZakatDue,
    debtDeducted: deductDebts,
    breakdown: {
      cash,
      goldWeight,
      goldValue,
      silverWeight,
      silverValue,
      stocks,
      receivables,
      ...(isGhamidi && { rentalIncome }),
      ...(isContemporary && { professionalIncome, businessInventory }),
    },
    ghamidiBreakdown,
    contemporaryBreakdown,
  };
}

/**
 * Parse string input to number, handling empty strings
 */
export function parseAmount(value: string): number {
  if (!value || value.trim() === '') {
    return 0;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

const CURRENCY_LOCALES: Record<Currency, string> = {
  AED: 'en-AE',
  PKR: 'en-PK',
};

/**
 * Format a numeric amount with group separators and 2 decimals.
 */
export function formatAmount(value: number, currency: Currency = 'AED'): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Compute the monetary value of a metal holding, handling tola→gram conversion.
 */
export function metalValue(weight: number, pricePerUnit: number, weightUnit: WeightUnit = 'gram'): number {
  const weightInGrams = toGrams(weight, weightUnit);
  const pricePerGram = toPerGram(pricePerUnit, weightUnit);
  return Math.round(weightInGrams * pricePerGram * 100) / 100;
}

export { GRAMS_PER_TOLA };
