import type { Cents } from './money';
import { fromDollars, min, sub, mulPercent, splitInto } from './money';
import { FINANCING_PLANS, type FinancingPlan } from './config';

export type CalculatorInputs = {
  treatmentDollars: number;
  coveragePercent: number;     // 0..100
  remainingBenefitDollars: number;
};

export type FinancingOption = {
  plan: FinancingPlan;
  totalCents: Cents;
  monthlyPayments: Cents[];    // length === plan.months
};

export type CalculatorResult = {
  treatmentCents: Cents;
  insuranceCoveredCents: Cents;
  outOfPocketCents: Cents;
  options: FinancingOption[];
};

const clampPercent = (p: number): number =>
  Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;

export const calculate = (inputs: CalculatorInputs): CalculatorResult => {
  const treatment = fromDollars(inputs.treatmentDollars);
  const remaining = fromDollars(inputs.remainingBenefitDollars);
  const coverage = clampPercent(inputs.coveragePercent) / 100;

  const insuranceEstimate = mulPercent(treatment, coverage);
  const insuranceCovered = min(insuranceEstimate, remaining);
  const outOfPocket = sub(treatment, insuranceCovered);

  const options: FinancingOption[] = FINANCING_PLANS.map((plan) => {
    const total = mulPercent(outOfPocket, 1 + plan.feeRate);
    const monthlyPayments = splitInto(total, plan.months);
    return { plan, totalCents: total, monthlyPayments };
  });

  return {
    treatmentCents: treatment,
    insuranceCoveredCents: insuranceCovered,
    outOfPocketCents: outOfPocket,
    options,
  };
};