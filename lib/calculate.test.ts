import { calculateZakat, parseAmount, formatAmount, ZakatInput } from './calculate';

/** Helper to build a ZakatInput with sensible defaults. */
function makeInput(overrides: Partial<ZakatInput> = {}): ZakatInput {
  return {
    cash: 0,
    goldWeight: 0,
    goldPricePerUnit: 250,
    silverWeight: 0,
    silverPricePerUnit: 5,
    stocks: 0,
    receivables: 0,
    debt: 0,
    nisabType: 'gold',
    ...overrides,
  };
}

describe('Zakat Calculator', () => {
  describe('calculateZakat', () => {
    it('should return zero zakat when all fields are empty', () => {
      const result = calculateZakat(makeInput());
      expect(result.zakatDue).toBe(0);
      expect(result.zakatable).toBe(false);
    });

    it('should return zero zakat when wealth is below nisab (gold standard)', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth = 15,000 AED (below nisab)
      const result = calculateZakat(makeInput({ cash: 15000 }));
      expect(result.nisabThreshold).toBe(21250);
      expect(result.netWealth).toBe(15000);
      expect(result.zakatDue).toBe(0);
      expect(result.zakatable).toBe(false);
    });

    it('should calculate zakat correctly when wealth is above nisab (gold standard)', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth = 25,000 AED (above nisab)
      // Zakat = 25,000 × 0.025 = 625 AED
      const result = calculateZakat(makeInput({ cash: 25000 }));
      expect(result.nisabThreshold).toBe(21250);
      expect(result.netWealth).toBe(25000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(625);
    });

    it('should calculate nisab correctly with silver standard', () => {
      // Nisab = 595g × 5 AED/g = 2,975 AED
      // Wealth = 5,000 AED (above nisab)
      // Zakat = 5,000 × 0.025 = 125 AED
      const result = calculateZakat(makeInput({ cash: 5000, nisabType: 'silver' }));
      expect(result.nisabThreshold).toBe(2975);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(125);
    });

    it('should deduct short-term debts from wealth', () => {
      // Wealth before debt = 30,000, Debt = 10,000, Net = 20,000 (below nisab 21,250)
      const result = calculateZakat(makeInput({ cash: 30000, debt: 10000 }));
      expect(result.totalWealthBeforeDebt).toBe(30000);
      expect(result.netWealth).toBe(20000);
      expect(result.nisabThreshold).toBe(21250);
      expect(result.zakatable).toBe(false);
      expect(result.zakatDue).toBe(0);
    });

    it('should handle debt greater than assets (clamp to 0)', () => {
      const result = calculateZakat(makeInput({
        cash: 5000,
        goldWeight: 12,
        goldPricePerUnit: 250,
        silverWeight: 400,
        silverPricePerUnit: 5,
        stocks: 1000,
        debt: 150000,
      }));
      expect(result.netWealth).toBe(0);
      expect(result.zakatDue).toBe(0);
    });

    it('should aggregate multiple asset types correctly', () => {
      // Gold: 20g × 250 = 5,000; Silver: 600g × 5 = 3,000
      // Total = 10,000 + 5,000 + 3,000 + 7,000 = 25,000
      const result = calculateZakat(makeInput({
        cash: 10000,
        goldWeight: 20,
        goldPricePerUnit: 250,
        silverWeight: 600,
        silverPricePerUnit: 5,
        stocks: 7000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.netWealth).toBe(25000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(625);
      expect(result.breakdown.cash).toBe(10000);
      expect(result.breakdown.goldValue).toBe(5000);
      expect(result.breakdown.silverValue).toBe(3000);
      expect(result.breakdown.stocks).toBe(7000);
      expect(result.breakdown.receivables).toBe(0);
    });

    it('should handle wealth exactly at nisab threshold', () => {
      // Nisab = 85 × 250 = 21,250
      // Zakat = 21,250 × 0.025 = 531.25
      const result = calculateZakat(makeInput({ cash: 21250 }));
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(531.25);
    });

    it('should round zakat to 2 decimal places', () => {
      // zakat = 23333 × 0.025 = 583.325 → 583.33
      const result = calculateZakat(makeInput({ cash: 23333 }));
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(583.33);
    });

    it('should handle very large numbers', () => {
      const result = calculateZakat(makeInput({
        cash: 1000000,
        goldWeight: 2000,
        goldPricePerUnit: 250,
        silverWeight: 60000,
        silverPricePerUnit: 5,
        stocks: 200000,
      }));
      // Total = 1,000,000 + 500,000 + 300,000 + 200,000 = 2,000,000
      expect(result.totalWealthBeforeDebt).toBe(2000000);
      expect(result.zakatDue).toBe(50000);
    });

    it('should ignore negative values (treat as 0)', () => {
      const result = calculateZakat(makeInput({
        cash: -5000,
        goldWeight: 120,
        goldPricePerUnit: 250,
        debt: -2000,
      }));
      // Cash clamped to 0, gold = 120 × 250 = 30,000
      expect(result.totalWealthBeforeDebt).toBe(30000);
      expect(result.netWealth).toBe(30000);
      expect(result.zakatDue).toBeGreaterThan(0);
    });

    it('should calculate nisab correctly with tola weight unit (gold)', () => {
      const pricePerTola = 250 * 11.6638;
      const result = calculateZakat(makeInput({
        cash: 25000,
        goldPricePerUnit: pricePerTola,
        silverPricePerUnit: 5 * 11.6638,
        weightUnit: 'tola',
      }));
      expect(result.nisabThreshold).toBeCloseTo(21250, 0);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBeCloseTo(625, 0);
    });

    it('should calculate nisab correctly with tola weight unit (silver)', () => {
      const pricePerTola = 5 * 11.6638;
      const result = calculateZakat(makeInput({
        cash: 5000,
        nisabType: 'silver',
        silverPricePerUnit: pricePerTola,
        weightUnit: 'tola',
      }));
      expect(result.nisabThreshold).toBeCloseTo(2975, 0);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBeCloseTo(125, 0);
    });

    it('should default to gram when weightUnit is not specified', () => {
      const result = calculateZakat(makeInput({ cash: 25000 }));
      expect(result.nisabThreshold).toBe(21250);
    });

    it('should include receivables in total wealth', () => {
      const result = calculateZakat(makeInput({
        cash: 10000,
        receivables: 5000,
        goldPricePerUnit: 100,
      }));
      // Nisab = 85 × 100 = 8,500; Total = 15,000
      expect(result.totalWealthBeforeDebt).toBe(15000);
      expect(result.breakdown.receivables).toBe(5000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(375);
    });

    it('should allow receivables to push wealth above nisab', () => {
      const result = calculateZakat(makeInput({
        cash: 8000,
        receivables: 1000,
        goldPricePerUnit: 100,
      }));
      // Nisab = 85 × 100 = 8,500; Total = 9,000
      expect(result.totalWealthBeforeDebt).toBe(9000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(225);
    });

    // Gold/silver weight-based tests
    it('should calculate gold value from weight × price', () => {
      // 10g × 250/g = 2,500
      const result = calculateZakat(makeInput({
        goldWeight: 10,
        goldPricePerUnit: 250,
      }));
      expect(result.breakdown.goldWeight).toBe(10);
      expect(result.breakdown.goldValue).toBe(2500);
      expect(result.totalWealthBeforeDebt).toBe(2500);
    });

    it('should calculate silver value from weight × price', () => {
      // 1000g × 5/g = 5,000
      const result = calculateZakat(makeInput({
        silverWeight: 1000,
        silverPricePerUnit: 5,
      }));
      expect(result.breakdown.silverWeight).toBe(1000);
      expect(result.breakdown.silverValue).toBe(5000);
      expect(result.totalWealthBeforeDebt).toBe(5000);
    });

    it('should use gold price for nisab when gold selected, silver price when silver selected', () => {
      const input = makeInput({
        cash: 25000,
        goldPricePerUnit: 250,
        silverPricePerUnit: 5,
        nisabType: 'gold',
      });
      const goldResult = calculateZakat(input);
      expect(goldResult.nisabThreshold).toBe(85 * 250); // 21,250

      const silverResult = calculateZakat({ ...input, nisabType: 'silver' });
      expect(silverResult.nisabThreshold).toBe(595 * 5); // 2,975
    });

    it('should return zero gold/silver value when weight is zero', () => {
      const result = calculateZakat(makeInput({
        goldWeight: 0,
        goldPricePerUnit: 250,
        silverWeight: 0,
        silverPricePerUnit: 5,
      }));
      expect(result.breakdown.goldValue).toBe(0);
      expect(result.breakdown.silverValue).toBe(0);
    });

    it('should compute gold value correctly with tola weight unit', () => {
      // 1 tola gold at 2916.0/tola → price/g = 2916/11.6638 = 250/g
      // Weight in grams = 1 × 11.6638 = 11.6638g
      // Value = 11.6638 × 250 = 2915.95
      const pricePerTola = 250 * 11.6638;
      const result = calculateZakat(makeInput({
        goldWeight: 1,
        goldPricePerUnit: pricePerTola,
        silverPricePerUnit: 5 * 11.6638,
        weightUnit: 'tola',
      }));
      expect(result.breakdown.goldValue).toBeCloseTo(2915.95, 0);
    });
  });

  describe('parseAmount', () => {
    it('should parse valid numeric strings', () => {
      expect(parseAmount('1000')).toBe(1000);
      expect(parseAmount('1000.50')).toBe(1000.5);
      expect(parseAmount('0')).toBe(0);
    });

    it('should return 0 for empty strings', () => {
      expect(parseAmount('')).toBe(0);
      expect(parseAmount('   ')).toBe(0);
    });

    it('should return 0 for non-numeric strings', () => {
      expect(parseAmount('abc')).toBe(0);
      expect(parseAmount('NaN')).toBe(0);
    });

    it('should clamp negative values to 0', () => {
      expect(parseAmount('-1000')).toBe(0);
      expect(parseAmount('-0.5')).toBe(0);
    });
  });

  describe('Ghamidi methodology', () => {
    it('should produce identical zakatDue when no Ghamidi-specific fields are set', () => {
      const standard = calculateZakat(makeInput({ cash: 25000, methodology: 'standard' }));
      const ghamidi = calculateZakat(makeInput({ cash: 25000, methodology: 'ghamidi' }));
      expect(ghamidi.zakatDue).toBe(standard.zakatDue);
      expect(ghamidi.ghamidiBreakdown).toBeDefined();
      expect(ghamidi.ghamidiBreakdown!.wealthZakat).toBe(standard.zakatDue);
      expect(ghamidi.ghamidiBreakdown!.agriculturalUshr).toBe(0);
      expect(ghamidi.ghamidiBreakdown!.totalCombined).toBe(standard.zakatDue);
    });

    it('should ignore Ghamidi fields when methodology is standard', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'standard',
        agriculturalProduce: 50000,
        rentalIncome: 10000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.ghamidiBreakdown).toBeUndefined();
    });

    it('should calculate agricultural ushr at 5% for irrigated', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: 100000,
        irrigationType: 'irrigated',
      }));
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(5000);
    });

    it('should calculate agricultural ushr at 10% for rain-fed', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: 100000,
        irrigationType: 'rain-fed',
      }));
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(10000);
    });

    it('should calculate ushr even when net wealth is below nisab', () => {
      const result = calculateZakat(makeInput({
        cash: 1000,
        methodology: 'ghamidi',
        agriculturalProduce: 50000,
        irrigationType: 'irrigated',
      }));
      expect(result.zakatable).toBe(false);
      expect(result.zakatDue).toBe(0);
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(2500);
      expect(result.ghamidiBreakdown!.totalCombined).toBe(2500);
    });

    it('should add rental income to wealth pool', () => {
      // Without rental: cash 8000, nisab = 85×100 = 8500 → below nisab
      const withoutRental = calculateZakat(makeInput({
        cash: 8000,
        goldPricePerUnit: 100,
        methodology: 'ghamidi',
      }));
      expect(withoutRental.zakatable).toBe(false);

      // With rental: cash 8000 + rental 1000 = 9000 → above nisab 8500
      const withRental = calculateZakat(makeInput({
        cash: 8000,
        goldPricePerUnit: 100,
        methodology: 'ghamidi',
        rentalIncome: 1000,
      }));
      expect(withRental.totalWealthBeforeDebt).toBe(9000);
      expect(withRental.zakatable).toBe(true);
      expect(withRental.zakatDue).toBe(225);
      expect(withRental.breakdown.rentalIncome).toBe(1000);
    });

    it('should compute totalCombined as zakatDue + agriculturalUshr', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: 40000,
        irrigationType: 'irrigated',
        rentalIncome: 5000,
      }));
      // Net wealth = 25000 + 5000 = 30000, zakatDue = 750
      // Ushr = 40000 × 0.05 = 2000
      // totalCombined = 750 + 2000 = 2750
      expect(result.zakatDue).toBe(750);
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(2000);
      expect(result.ghamidiBreakdown!.totalCombined).toBe(2750);
    });

    it('should clamp negative agricultural produce to 0', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: -5000,
        irrigationType: 'rain-fed',
      }));
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(0);
    });

    it('should default irrigationType to irrigated', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: 10000,
      }));
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(500); // 5%
    });

    it('should round ushr to 2 decimal places', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        agriculturalProduce: 33333,
        irrigationType: 'irrigated',
      }));
      // 33333 × 0.05 = 1666.65
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(1666.65);
    });
  });

  describe('Contemporary methodology', () => {
    it('should include professional income in wealth pool', () => {
      // cash 8000 + professionalIncome 2000 = 10000, nisab = 85×100 = 8500 → above
      const result = calculateZakat(makeInput({
        cash: 8000,
        goldPricePerUnit: 100,
        methodology: 'contemporary',
        professionalIncome: 2000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(10000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(250);
      expect(result.breakdown.professionalIncome).toBe(2000);
      expect(result.contemporaryBreakdown).toBeDefined();
      expect(result.contemporaryBreakdown!.professionalIncome).toBe(2000);
    });

    it('should include business inventory in wealth pool', () => {
      const result = calculateZakat(makeInput({
        cash: 10000,
        goldPricePerUnit: 100,
        methodology: 'contemporary',
        businessInventory: 15000,
      }));
      // Total = 10000 + 15000 = 25000; nisab = 8500
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(625);
      expect(result.breakdown.businessInventory).toBe(15000);
      expect(result.contemporaryBreakdown!.businessInventory).toBe(15000);
    });

    it('should ignore contemporary fields when methodology is standard', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'standard',
        professionalIncome: 10000,
        businessInventory: 5000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.contemporaryBreakdown).toBeUndefined();
      expect(result.breakdown.professionalIncome).toBeUndefined();
      expect(result.breakdown.businessInventory).toBeUndefined();
    });

    it('should ignore contemporary fields when methodology is ghamidi', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'ghamidi',
        professionalIncome: 10000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.contemporaryBreakdown).toBeUndefined();
    });

    it('should produce ghamidiBreakdown undefined for contemporary methodology', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'contemporary',
      }));
      expect(result.ghamidiBreakdown).toBeUndefined();
      expect(result.contemporaryBreakdown).toBeDefined();
    });

    it('should clamp negative contemporary inputs to 0', () => {
      const result = calculateZakat(makeInput({
        cash: 25000,
        methodology: 'contemporary',
        professionalIncome: -5000,
        businessInventory: -3000,
      }));
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.breakdown.professionalIncome).toBe(0);
      expect(result.breakdown.businessInventory).toBe(0);
    });
  });

  describe('Shafi\'i debt ruling (deductDebts: false)', () => {
    it('should not deduct debts when deductDebts is false', () => {
      // Without deduction: wealth 30000, debt 10000 — net stays 30000
      const result = calculateZakat(makeInput({
        cash: 30000,
        debt: 10000,
        deductDebts: false,
      }));
      expect(result.netWealth).toBe(30000);
      expect(result.debtDeducted).toBe(false);
      expect(result.zakatDue).toBe(750); // 30000 × 0.025
    });

    it('should deduct debts by default (deductDebts omitted)', () => {
      const result = calculateZakat(makeInput({ cash: 30000, debt: 10000 }));
      expect(result.netWealth).toBe(20000);
      expect(result.debtDeducted).toBe(true);
    });

    it('should deduct debts when deductDebts is true', () => {
      const result = calculateZakat(makeInput({
        cash: 30000,
        debt: 10000,
        deductDebts: true,
      }));
      expect(result.netWealth).toBe(20000);
      expect(result.debtDeducted).toBe(true);
    });

    it('should allow debt to push below nisab when deductDebts is true but not when false', () => {
      // Nisab = 85 × 250 = 21250
      // cash 25000, debt 10000 → net 15000 → below nisab
      const withDeduction = calculateZakat(makeInput({
        cash: 25000,
        debt: 10000,
        deductDebts: true,
      }));
      expect(withDeduction.zakatable).toBe(false);

      // Without deduction: net stays 25000 → above nisab
      const withoutDeduction = calculateZakat(makeInput({
        cash: 25000,
        debt: 10000,
        deductDebts: false,
      }));
      expect(withoutDeduction.zakatable).toBe(true);
      expect(withoutDeduction.zakatDue).toBe(625);
    });

    it('should work with deductDebts: false alongside ghamidi methodology', () => {
      const result = calculateZakat(makeInput({
        cash: 30000,
        debt: 10000,
        methodology: 'ghamidi',
        deductDebts: false,
        agriculturalProduce: 20000,
        irrigationType: 'irrigated',
      }));
      expect(result.netWealth).toBe(30000);
      expect(result.debtDeducted).toBe(false);
      expect(result.ghamidiBreakdown!.wealthZakat).toBe(750);
      expect(result.ghamidiBreakdown!.agriculturalUshr).toBe(1000);
      expect(result.ghamidiBreakdown!.totalCombined).toBe(1750);
    });
  });

  describe('formatAmount', () => {
    it('should format numbers with group separators', () => {
      const formatted = formatAmount(1000);
      expect(formatted).toBe('1,000.00');
    });

    it('should include 2 decimal places', () => {
      const formatted = formatAmount(100.5);
      expect(formatted).toBe('100.50');
    });

    it('should handle zero', () => {
      const formatted = formatAmount(0);
      expect(formatted).toBe('0.00');
    });
  });
});
