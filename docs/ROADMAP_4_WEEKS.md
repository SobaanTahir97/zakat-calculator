# 4-Week Roadmap — Zakat Calculator UAE

## Prerequisites (Day 0)

- Apple Developer Account enrolled ($99/yr) — *Assumption: already done or started*
- Node.js + Expo CLI installed
- Physical iPhone or TestFlight setup for testing

## Week-by-Week Plan

| Week | Outcome | Tasks | Dependencies | Definition of Done |
|------|---------|-------|--------------|--------------------|
| **1** | Core calculator working on device | 1. `npx create-expo-app` + project scaffold | None | App runs on simulator/device |
| | | 2. Build input form (cash, gold, silver, stocks, debt) | Task 1 | All fields accept AED input |
| | | 3. Implement calculation engine per CALC_RULES.md | Task 2 | Unit tests pass for all edge cases |
| | | 4. Build results/breakdown screen | Task 3 | Shows per-category + total Zakat |
| **2** | References + polish | 5. Create `data/references.json` with curated sources | None | All MVP references populated |
| | | 6. Build reference card component (tap category → see source) | Task 5 | Each category shows Quran + Hadith |
| | | 7. Add nisab selector (gold/silver toggle + price input) | Task 3 | Toggle works, recalculates correctly |
| | | 8. First-launch disclaimer modal + About screen | None | Disclaimer shows once, About always accessible |
| **3** | App Store prep + testing | 9. UI polish: colors, typography, spacing (Islamic-appropriate theme) | Tasks 1–8 | Looks professional on iPhone SE → 15 Pro Max |
| | | 10. Manual QA: test all edge cases from CALC_RULES.md | Task 9 | Zero crashes, correct calculations |
| | | 11. Take App Store screenshots (6.7" + 6.1" + 5.5") | Task 10 | 3 screenshot sets ready |
| | | 12. Write App Store metadata (title, subtitle, description, keywords) | None | Copy finalized |
| | | 13. Create app icon (1024×1024) | None | Icon meets Apple guidelines |
| **4** | Submit + buffer | 14. Build production `.ipa` via `eas build --platform ios` | Tasks 9–13 | Clean build, no errors |
| | | 15. Submit to App Store Connect + fill metadata | Task 14 | Status: "Waiting for Review" |
| | | 16. Respond to any Apple review feedback | Task 15 | App approved |
| | | 17. Bug-fix buffer (3–4 days) | Ongoing | Ship any critical fixes |

## App Store Review Notes

- *Assumption: Apple review takes 1–3 days for a simple calculator app*
- Submit by **end of Week 3** if possible to use Week 4 as full buffer
- Common rejection risks: missing privacy policy URL (add a simple one), disclaimer not prominent enough
- Add a Privacy Policy page (can be a simple GitHub Pages URL or Notion page)

## Risk Buffer

- Week 4 is intentionally light — only submission + bug fixes
- If Week 1–2 slip by 2 days, still shippable by cutting UI polish time
- If Apple rejects: most likely privacy policy or metadata issue — fixable in 1 day
