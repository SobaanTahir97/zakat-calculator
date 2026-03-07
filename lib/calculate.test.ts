import { calculateZakat, parseAmount, formatAmount, ZakatInput } from './calculate';

describe('Zakat Calculator', () => {
  describe('calculateZakat', () => {
    it('should return zero zakat when all fields are empty', () => {
      const input: ZakatInput = {
        cash: 0,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.zakatDue).toBe(0);
      expect(result.zakatable).toBe(false);
    });

    it('should return zero zakat when wealth is below nisab (gold standard)', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth = 15,000 AED (below nisab)
      const input: ZakatInput = {
        cash: 15000,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.nisabThreshold).toBe(21250);
      expect(result.netWealth).toBe(15000);
      expect(result.zakatDue).toBe(0);
      expect(result.zakatable).toBe(false);
    });

    it('should calculate zakat correctly when wealth is above nisab (gold standard)', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth = 25,000 AED (above nisab)
      // Zakat = 25,000 × 0.025 = 625 AED
      const input: ZakatInput = {
        cash: 25000,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.nisabThreshold).toBe(21250);
      expect(result.netWealth).toBe(25000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(625);
    });

    it('should calculate nisab correctly with silver standard', () => {
      // Nisab = 595g × 5 AED/g = 2,975 AED
      // Wealth = 5,000 AED (above nisab)
      // Zakat = 5,000 × 0.025 = 125 AED
      const input: ZakatInput = {
        cash: 5000,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'silver',
        pricePerGram: 5,
      };
      const result = calculateZakat(input);
      expect(result.nisabThreshold).toBe(2975);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(125);
    });

    it('should deduct short-term debts from wealth', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth before debt = 30,000 AED
      // Debt = 10,000 AED
      // Net wealth = 20,000 AED (below nisab after deduction)
      // Zakat = 0
      const input: ZakatInput = {
        cash: 30000,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 10000,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.totalWealthBeforeDebt).toBe(30000);
      expect(result.netWealth).toBe(20000);
      expect(result.nisabThreshold).toBe(21250);
      expect(result.zakatable).toBe(false);
      expect(result.zakatDue).toBe(0);
    });

    it('should handle debt greater than assets (clamp to 0)', () => {
      const input: ZakatInput = {
        cash: 5000,
        gold: 3000,
        silver: 2000,
        stocks: 1000,
        debt: 15000,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.totalWealthBeforeDebt).toBe(11000);
      expect(result.netWealth).toBe(0); // Clamped to 0
      expect(result.zakatDue).toBe(0);
    });

    it('should aggregate multiple asset types correctly', () => {
      // Total wealth = 10,000 + 5,000 + 3,000 + 7,000 = 25,000 AED
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Zakat = 25,000 × 0.025 = 625 AED
      const input: ZakatInput = {
        cash: 10000,
        gold: 5000,
        silver: 3000,
        stocks: 7000,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.totalWealthBeforeDebt).toBe(25000);
      expect(result.netWealth).toBe(25000);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(625);
      expect(result.breakdown.cash).toBe(10000);
      expect(result.breakdown.gold).toBe(5000);
      expect(result.breakdown.silver).toBe(3000);
      expect(result.breakdown.stocks).toBe(7000);
    });

    it('should handle wealth exactly at nisab threshold', () => {
      // Nisab = 85g × 250 AED/g = 21,250 AED
      // Wealth = 21,250 AED (exactly at nisab)
      // Zakat = 21,250 × 0.025 = 531.25 AED
      const input: ZakatInput = {
        cash: 21250,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(531.25);
    });

    it('should round zakat to 2 decimal places', () => {
      // cash = 23333, nisab = 85 × 250 = 21,250 (above nisab)
      // zakat = 23333 × 0.025 = 583.325 → rounds to 583.33
      const input: ZakatInput = {
        cash: 23333,
        gold: 0,
        silver: 0,
        stocks: 0,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.zakatable).toBe(true);
      expect(result.zakatDue).toBe(583.33);
    });

    it('should handle very large numbers', () => {
      const input: ZakatInput = {
        cash: 1000000,
        gold: 500000,
        silver: 300000,
        stocks: 200000,
        debt: 0,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.totalWealthBeforeDebt).toBe(2000000);
      expect(result.zakatDue).toBe(50000); // 2,000,000 × 0.025
    });

    it('should ignore negative values (treat as 0)', () => {
      const input: ZakatInput = {
        cash: -5000,
        gold: 30000,
        silver: 0,
        stocks: 0,
        debt: -2000,
        nisabType: 'gold',
        pricePerGram: 250,
      };
      const result = calculateZakat(input);
      expect(result.totalWealthBeforeDebt).toBe(30000);
      expect(result.netWealth).toBe(30000);
      expect(result.zakatDue).toBeGreaterThan(0);
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

