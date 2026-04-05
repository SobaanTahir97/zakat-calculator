const en = {
  // Home screen
  home: {
    title: 'Zakat Calculator',
    methodology: 'Methodology',
    standard: 'Standard',
    ghamidi: 'Ghamidi',
    contemporary: 'Contemporary',
    standardDesc:
      'Classical consensus of the four Sunni schools (Hanafi, Maliki, Shafi\u02be\u012b, Hanbali).',
    ghamidiDesc:
      "Javed Ahmad Ghamidi's Qur\u02be\u0101n & Sunnah methodology \u2014 includes ushr and rental income.",
    contemporaryDesc:
      'Contemporary ijtih\u0101d (Qaradawi) \u2014 extends zakat to professional income and business inventory.',
    yourAssets: 'Your Assets',
    cashLabel: 'Cash & Bank Balance',
    cashHelper: 'Savings, current, fixed deposits',
    goldLabel: 'Gold Owned',
    goldHelper:
      'Weight in {{unit}} \u2014 Hanafi: include all gold. Maliki/Shafi\u02be\u012b/Hanbali: exclude regularly worn jewellery.',
    goldValueHelper: '= {{value}}',
    goldRate: 'Gold Rate (per {{unit}})',
    silverLabel: 'Silver Owned',
    silverHelper: 'Enter weight in {{unit}}',
    silverValueHelper: '= {{value}}',
    silverRate: 'Silver Rate (per {{unit}})',
    stocksLabel: 'Stocks & Investments',
    stocksHelper: 'Current market value',
    receivablesLabel: 'Money Owed to You',
    receivablesHelper: 'Debts others owe you (expected to be repaid)',
    // Ghamidi-specific
    ghamidiAssets: 'Ghamidi-Specific Assets',
    ghamidiAssetsDesc: 'These categories are zakatable under Ghamidi\u2019s methodology.',
    agriculturalProduce: 'Agricultural Produce',
    agriculturalHelperIrrigated: 'Market value of harvest (Ushr: 5%)',
    agriculturalHelperRainFed: 'Market value of harvest (Ushr: 10%)',
    irrigated: 'Irrigated (5%)',
    rainFed: 'Rain-fed (10%)',
    rentalIncome: 'Rental Income from Property',
    rentalHelper: 'Annual rental income (added to wealth at 2.5%)',
    // Contemporary-specific
    contemporaryAssets: 'Contemporary Assets',
    contemporaryAssetsDesc:
      'Qaradawi\u2019s ijtih\u0101d extends zakat to modern income and trade wealth. These are added to your wealth pool at 2.5%.',
    professionalIncome: 'Professional / Salary Income',
    professionalHelper: 'Annual income from employment or self-employment (2.5%)',
    businessInventory: 'Business Inventory',
    businessHelper: 'Current market selling value of trade goods (2.5%)',
    // Deductions
    deductions: 'Deductions',
    debtLabel: 'Short-term Debts',
    debtHelper: 'Due within 12 months',
    doNotDeductDebts: 'Do not deduct debts',
    shafiiNote: 'Sh\u0101fi\u02bf\u012b school \u2014 debt does not reduce zakatable wealth',
    debtIgnoredNote: 'Debt field ignored. Zakat calculated on full net wealth before debt.',
    // Rate status
    fetchingRate: 'Fetching live rate...',
    rateAutoFilled: 'Auto-filled from {{source}} ({{date}})',
    rateAutoFilledNoDate: 'Auto-filled from {{source}}',
    rateUnavailable: 'Live rate unavailable. Enter price manually.',
    enterRate: 'Enter the current local rate per {{unit}}.',
    // Buttons
    calculateZakat: 'Calculate Zakat',
    aboutDisclaimer: 'About & Disclaimer',
  },

  // Results screen
  results: {
    ghamidiMethodology: "Ghamidi's Methodology",
    contemporaryMethodology: 'Contemporary Methodology (Qaradawi)',
    standardMethodology: 'Standard Methodology',
    zakatDue: 'Zakat Due',
    totalZakatUshrDue: 'Total Zakat & Ushr Due',
    wealthZakat: 'Wealth Zakat (2.5%)',
    agriculturalUshr: 'Agricultural Ushr ({{rate}})',
    aboveNisab: 'Net wealth is above the nisab threshold.',
    belowNisab: 'Wealth is below nisab threshold.',
    belowNisabWithUshr:
      'Wealth is below nisab, but ushr is still due on agricultural produce.',
    netWealth: 'Net Wealth',
    nisab: 'Nisab',
    wealthSummary: 'Wealth Summary',
    totalAssets: 'Total Assets',
    totalDebts: 'Total Debts',
    totalDebtsShafii: 'Total Debts (not deducted \u2014 Sh\u0101fi\u02bf\u012b)',
    nisabThreshold: 'Nisab Threshold',
    assetBreakdown: 'Asset Breakdown',
    cashBank: 'Cash & Bank Balance',
    gold: 'Gold ({{weight}} {{unit}})',
    silver: 'Silver ({{weight}} {{unit}})',
    stocksInvestments: 'Stocks & Investments',
    moneyOwed: 'Money Owed to You',
    rentalIncome: 'Rental Income',
    professionalIncome: 'Professional / Salary Income',
    businessInventory: 'Business Inventory',
    agriculturalUshrSection: 'Agricultural Ushr',
    produceValue: 'Produce Value',
    ushrDue: 'Ushr Due ({{rate}})',
    references: 'References',
    zakatObligation: 'Zakat Obligation',
    goldSilver: 'Gold & Silver',
    cash: 'Cash',
    stocks: 'Stocks & Investments',
    moneyOwedRef: 'Money Owed to You',
    debtDeduction: 'Debt Deduction',
    scholarGhamidi: "Scholar's Perspective: Ghamidi",
    agriculturalProduceRef: 'Agricultural Produce (Ushr)',
    rentalIncomeRef: 'Rental Income',
    contemporaryRef: 'Contemporary Methodology (Qaradawi)',
    backToCalculator: 'Back to Calculator',
  },

  // About screen
  about: {
    title: 'About This App',
    purpose: 'Purpose',
    purposeText:
      'Zakat Calculator is a simple tool for estimating annual zakat obligations using the standard 2.5% rule above nisab.',
    howItWorks: 'How It Works',
    howItWorksText:
      'Enter your cash, gold, silver, and investment holdings. The app compares total net wealth against the nisab minimum and calculates zakat due at 2.5%.',
    sources: 'Sources',
    sourcesText:
      'References are sourced from established Quran and hadith collections, and shown per category for transparency.',
    version: 'Version',
    viewDisclaimer: 'View Full Disclaimer',
  },

  // Disclaimer modal
  disclaimer: {
    title: 'Important Disclaimer',
    religiousGuidance: 'Religious Guidance',
    religiousGuidanceText:
      'This app is a calculation tool only and does not constitute a religious ruling (fatwa). Zakat obligations may vary based on individual circumstances, scholarly interpretation, and your specific madhab.',
    consultScholar: 'Consult a Scholar',
    consultScholarText:
      'Consult a qualified Islamic scholar before making financial decisions based on this calculator.',
    sourcing: 'Sourcing',
    sourcingText:
      'We aim to use authentic, widely accepted sources from Quran and hadith collections, but cannot guarantee completeness in every scenario.',
    liability: 'Liability',
    liabilityText:
      'Developers and app distributors are not liable for losses or claims from app usage. Final zakat responsibility remains with the user.',
    iUnderstand: 'I Understand',
  },

  // Nisab selector
  nisab: {
    title: 'Nisab Threshold',
    goldGram: 'Gold (85g)',
    silverGram: 'Silver (595g)',
    goldTola: 'Gold (7.5 tola)',
    silverTola: 'Silver (51 tola)',
    gram: 'Gram',
    tola: 'Tola',
  },

  // Calculation explanation
  calculation: {
    title: 'How Calculation Works',
    show: 'Show',
    hide: 'Hide',
    step1: '1. Add assets: cash, gold/silver, stocks, and receivables.',
    source1: 'Consensus \u2014 all four Sunni schools (Hanafi, Maliki, Sh\u0101fi\u02bf\u012b, Hanbali)',
    step2Deduct: '2. Subtract short-term debts due within 12 months.',
    source2Deduct: 'Hanafi, Maliki, Hanbali \u2014 Muwatta\u02be Imam Malik; practice of \u02bfUthm\u0101n ibn \u02bfAff\u0101n (RA)',
    step2NoDeduct: '2. Debts not deducted (Sh\u0101fi\u02bf\u012b ruling \u2014 zakat attaches to capacity, not net wealth).',
    source2NoDeduct: 'Sh\u0101fi\u02bf\u012b school \u2014 debt obligation attaches to the dhimma (legal capacity), not specific wealth',
    step3: '3. If net wealth \u2265 nisab, zakat is 2.5% of net wealth.',
    source3: 'Sunan Ab\u016b D\u0101w\u016bd 1573 (\u02bfAl\u012b ibn Ab\u012b \u1e6c\u0101lib RA) \u2014 nisab: 85g gold or 595g silver',
    step4Ghamidi: '4. Agricultural produce: Ushr at 5% (irrigated) or 10% (rain-fed). No nisab required.',
    source4Ghamidi: '\u1e62a\u1e25\u012b\u1e25 al-Bukh\u0101r\u012b 1483 (Ibn \u02bfUmar RA); Al-An\u02bf\u0101m 6:141 \u2014 "give its due on the day of harvest"',
    step5Ghamidi: '5. Rental income is added to the wealth pool and taxed at 2.5%.',
    source5Ghamidi: 'Al-Baqarah 2:267; Ghamidi ijtih\u0101d extending zakatable wealth to income-producing assets',
    step4Contemporary: '4. Professional / salary income is included in the wealth pool at 2.5%. No haul (waiting year) required.',
    source4Contemporary: 'Qaradawi \u2014 Fiqh al-Zak\u0101t; Al-Baqarah 2:267 \u2014 "spend of the good things which you have earned"',
    step5Contemporary: '5. Business inventory (trade goods) is included at current market selling price, 2.5%.',
    source5Contemporary: 'Consensus of all four schools on \u02bfur\u016b\u1e0d al-tij\u0101rah (trade goods) \u2014 \u1e62a\u1e25\u012b\u1e25 al-Bukh\u0101r\u012b',
    nisabNote: 'Nisab: gold (85g) or silver (595g).',
    formulaNet: 'net_wealth = assets - short_term_debt',
    formulaNetNoDebt: 'net_wealth = assets (debt not deducted)',
    formulaZakat: 'zakat_due = net_wealth * 0.025 (if net_wealth >= nisab)',
    formulaUshr: 'ushr = produce * 0.05 or 0.10 (no nisab required)',
    formulaContemporary: 'wealth += professional_income + business_inventory',
  },

  // Currency picker
  currency: {
    uaeDirham: 'UAE Dirham',
    pakistaniRupee: 'Pakistani Rupee',
    aedCountry: 'UAE',
    aedName: 'Dirham',
    pkrCountry: 'Pakistan',
    pkrName: 'Rupee',
  },

  // Reference screen
  reference: {
    quran: 'Quran',
    hadith: 'Hadith',
    source: 'Source:',
    narrator: 'Narrator:',
    explanation: 'Explanation',
    notFound: 'Reference not found',
    disclaimerText:
      'This reference is provided for educational purposes. For personal guidance on zakat obligations, please consult with a qualified Islamic scholar.',
  },

  // Navigation / Stack headers
  nav: {
    zakatDue: 'Zakat Due',
    reference: 'Reference',
    about: 'About',
  },
} as const;

export default en;
