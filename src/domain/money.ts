// All money is represented internally as integer cents.
// Display layer converts to dollars with exactly 2 decimal places.

export type Cents = number & { readonly __brand: 'Cents' };

export const fromDollars = (dollars: number): Cents => {
  if (!Number.isFinite(dollars) || dollars < 0) return 0 as Cents;
  return Math.round(dollars * 100) as Cents;
};

export const toDollars = (cents: Cents): number => cents / 100;

export const formatUSD = (cents: Cents): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toDollars(cents));

export const min = (a: Cents, b: Cents): Cents => Math.min(a, b) as Cents;
export const sub = (a: Cents, b: Cents): Cents => Math.max(0, a - b) as Cents;

export const mulPercent = (cents: Cents, percent: number): Cents =>
  Math.round(cents * percent) as Cents;



export const splitInto = (cents: Cents, n: number): Cents[] => {
  if (n <= 0) return [];
  const base = Math.floor(cents / n);
  const remainder = cents - base * n;
  return Array.from({ length: n }, (_, i) =>
    (i === n - 1 ? base + remainder : base) as Cents
  );
};