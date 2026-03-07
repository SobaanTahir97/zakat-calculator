# Sources & Disclaimer Strategy — MVP

## Reference Structure

Each asset category gets a **reference card** with:
- 1 Quran ayah (Arabic text + translation + surah:ayah number)
- 1 Hadith (matn summary + source collection + grading)
- 1-sentence plain-English explanation of the rule

References are stored as a JSON file (`data/references.json`) keyed by category. This makes them easy to update, review, and extend without code changes.

### MVP Reference Slots

| Category | Quran | Hadith |
|----------|-------|--------|
| General Zakat obligation | Al-Baqarah 2:267 | Bukhari 1395 (five pillars) |
| Gold & Silver | At-Tawbah 9:34 | Abu Dawud 1573 (gold/silver nisab) |
| Cash (by analogy to gold) | At-Tawbah 9:34 | Same as gold |
| Stocks (by analogy) | Al-Baqarah 2:267 | General wealth hadith |

*Assumption: these are well-established, sahih references. Final text to be verified by the builder before submission.*

## Trust Layer Strategy

1. **Only use sahih (authentic) hadith** from Bukhari, Muslim, Abu Dawud, Tirmidhi
2. **Only use widely accepted Quran translations** (Sahih International or similar)
3. **No fatwa claims** — app presents calculations, not rulings
4. **Visible sourcing** — every rule links to its reference; nothing is "just trust us"
5. **Review step** — builder manually verifies each reference before App Store submission
6. **Future**: invite a scholar for a light review; add a "reviewed by" badge

## Disclaimer Copy (App Store + In-App)

> **Disclaimer**: This app is a calculation tool only and does not constitute a religious ruling (fatwa). Zakat obligations may vary based on individual circumstances and scholarly interpretation. We recommend consulting a qualified Islamic scholar for personal guidance. The developers have made every effort to use authentic, widely-accepted sources (Quran and Sahih Hadith), but cannot guarantee completeness. Use at your own discretion.

## Future Plan

- **v1.1**: Add madhab selector (Hanafi, Shafi'i, Maliki, Hanbali) with per-madhab notes on key differences (e.g., jewelry exemption)
- **v1.2**: Partner with a local UAE Islamic authority or scholar for formal review
- **v2**: Deeper reference library with multiple hadith per topic, scholarly commentary links
