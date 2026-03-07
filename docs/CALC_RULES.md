# Zakat Calculation Rules — MVP

## Supported Streams

| Stream | Input | Zakatable? | Notes |
|--------|-------|-----------|-------|
| Cash & bank balances | AED amount | Yes, full amount | Includes savings, current, fixed deposits |
| Gold | Grams or AED value | Yes, full amount | Personal + investment gold. *Assumption: no worn-jewelry exemption in MVP (simplicity)* |
| Silver | Grams or AED value | Yes, full amount | Same as gold |
| Stocks & investments | Market value in AED | Yes, full market value | *Assumption: using full market value method, not net-asset-value method, for simplicity* |

## Nisab Handling

- User selects **gold standard** (85g gold) or **silver standard** (595g silver) — default: gold
- User enters current price per gram in AED manually
- Nisab threshold = weight × price-per-gram
- If total zakatable wealth ≥ nisab → Zakat = 2.5% of **total** zakatable wealth (not just the excess)
- *Assumption: 2.5% on total wealth above nisab is the majority scholarly position used here*

## Debt Deductions

- User enters **short-term debts due within 12 months** (AED)
- Deducted from total wealth before nisab comparison
- Long-term debts (mortgage, multi-year loans): **deferred to v2** — too many scholarly opinions
- *Assumption: simple subtraction model is MVP-safe and aligns with majority opinion*

## Formula

```
net_wealth = cash + gold_value + silver_value + stocks - short_term_debt
if net_wealth >= nisab_threshold:
    zakat_due = net_wealth * 0.025
else:
    zakat_due = 0
```

## Edge Cases (MVP)

| Case | Handling |
|------|----------|
| Wealth just below nisab | Show "No Zakat due" + explanation |
| All fields zero | Show "No Zakat due" (no error) |
| Negative net wealth (debt > assets) | Clamp to 0, show "No Zakat due" |
| Very large numbers | Use standard JS number; no special handling needed for AED amounts |

## Intentionally Deferred

- Business/trade inventory zakat
- Agricultural produce (crops, livestock)
- Cryptocurrency
- Real estate (rental income vs. capital)
- Worn jewelry exemption (Hanafi vs. other madhabs)
- Hawl (lunar year) tracking / date-based reminders
- Live gold/silver price API integration
- Per-madhab calculation differences
