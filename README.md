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


1) Implement money helper first. 
  - Use branded Cents type makes sure we can't pass number or dollars to a funciton expecting cents. Represent money as integer cents. Display layer converts to dollars with two decimal places. 
  - 

# Money Helper
  Assumptions: 
  - All amounts are in USD with two decimal place precision. Sub cent amounts and non US currency are out of scope.
  - Negative and non finite (Nan, Infinity from parsing empty string) inputs are coerced to zero rather than rejected. Keeps calc usable while editing.
  - All money math is done in integer cents -- round to nearest cent at every multiplication step 
  - We want payments to reconcile in all situations (e.g. 3 payments on a $100.00 bill must == $100.00. Payments = [$33.33, $33.33, $33.34]) If there is a remainder when deviding payments, add to final payment. 

  Tradeoffs: 
  - Money represented as integer cents in a small helper rather than a library. This avoids runtime dependency for about 30 lines of code. // Maybe: If the calculator needed to expand to multi currency support, or more advanced calculations I would switch to a library. 
  - Branded Typescript type: type Cents = number & { __brand: 'Cents' } used instead of wrapper class. Values stay as normal numbers at runtime - zero overhead and easy to inspect in debugger while the compiler still prevents passing dollars where cents are expected.
  -


  # Finance Config
  Assumptions: 
  - The financing fee schedules should be easy to change and therefore stored in config file rather than be embedded in the UI
  Tradeoffs: 
  - For the pay in full option model as a one month plan with zero fee instead of a special case.

  