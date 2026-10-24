# FinSight AI — Hackathon MVP

A functional, local-first financial decision-support prototype combining TrustGraph, FinTwin and DecisionDNA.

## Run in VS Code
1. Install Node.js 20+.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit http://localhost:3000.

## What works
- TrustGraph: deterministic phrase-based warning detection for pasted offer terms. **Not** independent fact verification or AI-based document reading.
- FinTwin: amortized monthly payment calculation, normal and stress-case cash flow, savings chart, break-even income, income reduction slider.
- DecisionDNA: priority and reasoning prompts, transparent personalized challenges (not psychological profiling).
- Decision Passport: combined summary, local text export.

## Suggested 2-person split
- Developer A: UI, DecisionDNA, report, deployment.
- Developer B: TrustGraph enhancements, financial model tests, optional OCR/LLM integration.

## Demo
1. Investigate the sample offer.
2. Simulate the financing with default inputs.
3. Increase income reduction until cash flow turns negative.
4. Answer DecisionDNA questions.
5. Export Decision Passport.

## Next upgrades (after baseline works)
- Optional OCR for screenshots and PDFs; review extracted terms before calculations.
- LLM-based claim extraction returning structured JSON with quoted evidence, source position, and uncertainty.
- Official source retrieval and citations (never label a claim verified solely because an LLM says so).
- Comparison of two offers and Monte Carlo simulation with disclosed assumptions.

## Financial-model assumptions
- Fixed APR and level monthly payments, no fees included unless separately modeled.
- Monthly income/expenses constant; stress income reduction applies for the entire horizon.
- One emergency cost in month 3.
- No taxes, inflation, or compounding on savings.
- Educational tool only, not financial advice.
