# Execution Pack for Claude Code (Haiku)

## Stack

**React Native (Expo SDK 52, managed workflow)** + TypeScript. No backend. No external APIs. All data is local JSON.

Build tool: EAS Build (`eas build --platform ios`). Needs Expo account + Apple Developer credentials.

## File Tree

```
zakat-calculator/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx         # Root layout + first-launch disclaimer
│   ├── index.tsx           # Home / input form
│   ├── results.tsx         # Breakdown screen
│   ├── reference/[id].tsx  # Reference card per category
│   └── about.tsx           # About + disclaimer
├── lib/
│   ├── calculate.ts        # Zakat calculation engine
│   └── calculate.test.ts   # Unit tests
├── data/
│   └── references.json     # Curated Quran + Hadith references
├── components/
│   ├── AssetInput.tsx       # Reusable input row
│   ├── NisabSelector.tsx    # Gold/silver toggle + price
│   ├── BreakdownCard.tsx    # Per-category result
│   └── DisclaimerModal.tsx  # First-launch modal
├── constants/
│   └── theme.ts            # Colors, fonts, spacing
├── app.json
├── package.json
├── tsconfig.json
└── docs/                   # Planning docs (this folder)
```

## Ordered Task List

1. Run `npx create-expo-app zakat-calculator -t tabs` and clean boilerplate
2. Set up Expo Router with the 4 screens (index, results, reference/[id], about)
3. Create `constants/theme.ts` with color palette and spacing
4. **STOP — verify app runs on simulator, all screens navigate correctly**
5. Build `AssetInput.tsx` component (label + AED input + validation)
6. Build input form on `index.tsx` (cash, gold, silver, stocks, debt fields)
7. Implement `lib/calculate.ts` per `docs/CALC_RULES.md` formula
8. Write unit tests in `lib/calculate.test.ts` (all edge cases from CALC_RULES)
9. **STOP — run tests, all must pass**
10. Build `results.tsx` — reads inputs, calls calculate, shows breakdown
11. Create `data/references.json` with MVP references from `docs/SOURCES_AND_DISCLAIMER.md`
12. Build `NisabSelector.tsx` (gold/silver toggle + manual price input)
13. Build `reference/[id].tsx` — displays Quran + Hadith for tapped category
14. **STOP — full flow works: input → calculate → results → reference cards**
15. Build `DisclaimerModal.tsx` + first-launch logic (AsyncStorage flag)
16. Build `about.tsx` with disclaimer text + app info
17. UI polish: apply theme, responsive layout, test on multiple screen sizes
18. Final QA pass against acceptance criteria in `docs/PRD.md`

## First Command

```
npx create-expo-app zakat-calculator -t tabs && cd zakat-calculator && npx expo install expo-router expo-constants expo-linking @react-native-async-storage/async-storage && rm -rf app/ && mkdir -p app lib data components constants docs
```

Then tell the agent: "Read all files in `docs/` for full context. Start with task 1 from `docs/EXECUTION_PACK_FOR_HAIKU.md`. Complete tasks sequentially. Stop at each STOP point and report status."
