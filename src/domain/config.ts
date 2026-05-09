
export type FinancingPlan = {
  readonly id: string;
  readonly label: string;
  readonly months: number;
  readonly feeRate: number; // 0.05 = 5% flat fee on the financed amount
};

// Pay-in-full is modeled as months: 1 so it shares the FinancingOption shape.
// Consumers should special-case id === 'pay-in-full' in the UI rather than
// rendering it as "1 monthly payment".
export const FINANCING_PLANS = [
  { id: 'pay-in-full', label: 'Pay in full',         months: 1,  feeRate: 0    },
  { id: '3-month',     label: '3 monthly payments',  months: 3,  feeRate: 0    },
  { id: '6-month',     label: '6 monthly payments',  months: 6,  feeRate: 0.05 },
  { id: '12-month',    label: '12 monthly payments', months: 12, feeRate: 0.10 },
] as const satisfies readonly FinancingPlan[];

export type PlanId = (typeof FINANCING_PLANS)[number]['id'];

export const DEFAULT_TREATMENT_DOLLARS = 1000;
export const DEFAULT_COVERAGE_PERCENT = 50;
export const DEFAULT_REMAINING_DOLLARS = 2000;