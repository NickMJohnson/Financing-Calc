
export type FinancingPlan = {
  id: string;
  label: string;
  months: number;
  feeRate: number; // 0.05 = 5% flat fee on the financed amount
};

export const FINANCING_PLANS: FinancingPlan[] = [
  { id: 'pay-in-full', label: 'Pay in full',         months: 1,  feeRate: 0    },
  { id: '3-month',     label: '3 monthly payments',  months: 3,  feeRate: 0    },
  { id: '6-month',     label: '6 monthly payments',  months: 6,  feeRate: 0.05 },
  { id: '12-month',    label: '12 monthly payments', months: 12, feeRate: 0.10 },
];

export const DEFAULT_TREATMENT_DOLLARS = 1000;
export const DEFAULT_COVERAGE_PERCENT = 50;
export const DEFAULT_REMAINING_DOLLARS = 2000;