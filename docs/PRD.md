# PRD — Zakat Calculator UAE v1

## Overview

A simple, trustworthy Zakat calculator for Muslims in the UAE. Users enter their assets (cash, gold/silver, stocks), subtract eligible debts, and receive a clear breakdown of Zakat owed in AED — with references to Quran and Hadith for each rule. English-only MVP; free app; no account required.

## MVP In

- Cash & bank balance entry (AED)
- Gold & silver entry (grams or AED value)
- Stock/investment entry (market value in AED)
- Debt deduction (short-term liabilities only)
- Nisab check (user picks gold or silver standard; default gold)
- Zakat = 2.5% of net zakatable wealth above nisab
- Breakdown screen showing per-category amounts
- Reference card per category (Quran ayah + Hadith, max 2 each)
- App Store disclaimer screen + in-app "About" with sourcing info

## MVP Out

- Business/trade zakat, agricultural zakat, crypto, real estate
- Arabic UI (v1.1)
- Madhab-specific toggle
- Gold/silver live price API (user enters manually; *Assumption: manual entry is acceptable for v1*)
- User accounts, history, sync
- Push notifications, reminders

## Target User

UAE-resident Muslim (25–45), salaried or with savings, wants a quick annual Zakat check. Likely searches "zakat calculator" on the App Store during Ramadan.

## Key Flows

1. **Calculate** — Home -> Enter assets per category -> View nisab status -> See total Zakat owed (AED) + breakdown
2. **Learn** — Tap any category -> See brief explanation + Quran/Hadith reference
3. **Disclaimer** — Accessible from About; shown on first launch

## App Store Positioning (UAE)

- **Title**: "Zakat Calculator UAE — Simple & Sourced"
- **Keywords**: zakat, calculator, UAE, AED, Islamic finance, Ramadan
- **Category**: Finance (primary), Reference (secondary)
- *Assumption: "Finance" category has better discoverability than "Lifestyle" for UAE users*

## Acceptance Criteria for "Ship"

1. User can complete the Calculate flow end-to-end without crashes
2. Nisab threshold is correct for both gold and silver standards
3. At least 1 Quran reference and 1 Hadith reference per asset category
4. Disclaimer is shown on first launch and accessible from About
5. App passes Apple review (no rejected binary)
6. Listed on UAE App Store in English
