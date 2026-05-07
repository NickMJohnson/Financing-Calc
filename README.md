# Dental Treatment Financing Calculator

Take-home build. A small web tool a dental office manager can use, in front of a patient, to walk through what insurance covers, what the patient owes, and a few payment plan options — updating in real time as the numbers change.

## What it needs to do

**Inputs**
- Treatment amount (default $1,000)
- Insurance coverage % (0–100, slider or input)
- Remaining annual insurance benefit

**Outputs**
- Insurance covered amount — capped at the remaining benefit
- Patient out-of-pocket
- Payment options, each with the monthly amount:
  - Pay in full
  - 3 months — no fee
  - 6 months — 5% fee
  - 12 months — 10% fee

**The math**
1. `estimate = treatment × coverage%`
2. `covered  = min(estimate, remaining benefit)`
3. `out-of-pocket = treatment − covered`
4. `monthly  = (out-of-pocket × (1 + fee)) / months`

**Edge cases:** 0% / 100% coverage, $0 remaining benefit, decimal inputs, negative or empty inputs (clamp to something sensible). All money displayed to two decimal places.

## Plan

1. Vite + React + TypeScript scaffold.
2. Pure calc functions in `src/lib` with no React imports, plus unit tests for the cap behavior and each financing plan.
3. A thin validation layer that clamps junk inputs (negatives, > 100%, NaN) before they reach the calc.
4. UI on top of a `useCalculator` hook — inputs panel, results panel, payment option cards.
5. Tailwind for layout. No submit button, everything updates live.
6. Deploy to Vercel if time allows.

## How to run 

## Tradoffs and Assumptions
