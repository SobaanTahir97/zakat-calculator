/**
 * Zakat calculation engine
 * Based on MVP rules: https://docs.zakat-calculator.local/CALC_RULES.md
 */

export interface ZakatInput {
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  debt: number;
  nisabType: 'gold' | 'silver';
  pricePerGram: number;
}

export interface ZakatResult {
  totalWealthBeforeDebt: number;
  netWealth: number;
  nisabThreshold: number;
  zakatable: boolean;
  zakatDue: number;
  breakdown: {
    cash: number;
    gold: number;
    silver: number;
    stocks: number;
  };
}

/**
 * Calculate Nisab threshold based on selected standard
 * Gold: 85g × price-per-gram
 * Silver: 595g × price-per-gram
 */
function calculateNisab(nisabType: 'gold' | 'silver', pricePerGram: number): number {
  const goldWeight = 85; // grams
  const silverWeight = 595; // grams
  const weight = nisabType === 'gold' ? goldWeight : silverWeight;
  return weight * pricePerGram;
}

/**
 * Main zakat calculation function
 * Returns detailed result with breakdown
 */
export function calculateZakat(input: ZakatInput): ZakatResult {
  // Validate inputs
  const cash = Math.max(0, input.cash);
  const gold = Math.max(0, input.gold);
  const silver = Math.max(0, input.silver);
  const stocks = Math.max(0, input.stocks);
  const debt = Math.max(0, input.debt);
  const pricePerGram = Math.max(0, input.pricePerGram);

  // Calculate total wealth before debt deduction
  const totalWealthBeforeDebt = cash + gold + silver + stocks;

  // Deduct short-term debts
  const netWealth = Math.max(0, totalWealthBeforeDebt - debt);

  // Calculate nisab threshold
  const nisabThreshold = calculateNisab(input.nisabType, pricePerGram);

  // Determine if zakat is due
  const zakatable = netWealth >= nisabThreshold;

  // Calculate zakat due (2.5% of net wealth if above nisab, otherwise 0)
  const zakatDue = zakatable ? netWealth * 0.025 : 0;

  return {
    totalWealthBeforeDebt,
    netWealth,
    nisabThreshold,
    zakatable,
    zakatDue: Math.round(zakatDue * 100) / 100, // Round to 2 decimal places
    breakdown: {
      cash,
      gold,
      silver,
      stocks,
    },
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

/**
 * Format a numeric amount with group separators and 2 decimals.
 */
export function formatAmount(value: number): string {
  return new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
