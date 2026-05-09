import { describe, it, expect } from 'vitest';
import { calculate } from './financing';
import { formatUSD } from './money';
import type { Cents } from './money';

describe('calculate — spec examples', () => {
  it('Example A: cap NOT reached', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 50,
      remainingBenefitDollars: 2000,
    });
    expect(r.insuranceCoveredCents).toBe(50000);
    expect(r.outOfPocketCents).toBe(50000);
  });

  it('Example B: cap IS reached', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 50,
      remainingBenefitDollars: 200,
    });
    expect(r.insuranceCoveredCents).toBe(20000);
    expect(r.outOfPocketCents).toBe(80000);
  });
});

describe('calculate — edge cases', () => {
  it('handles 0% coverage', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 0,
      remainingBenefitDollars: 2000,
    });
    expect(r.insuranceCoveredCents).toBe(0);
    expect(r.outOfPocketCents).toBe(100000);
  });

  it('handles 100% coverage with sufficient benefit', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 100,
      remainingBenefitDollars: 2000,
    });
    expect(r.insuranceCoveredCents).toBe(100000);
    expect(r.outOfPocketCents).toBe(0);
  });

  it('handles 100% coverage when benefit is the binding constraint', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 100,
      remainingBenefitDollars: 300,
    });
    expect(r.insuranceCoveredCents).toBe(30000);
    expect(r.outOfPocketCents).toBe(70000);
  });

  it('handles remaining benefit = 0', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 80,
      remainingBenefitDollars: 0,
    });
    expect(r.insuranceCoveredCents).toBe(0);
    expect(r.outOfPocketCents).toBe(100000);
  });

  it('handles treatment cost = 0', () => {
    const r = calculate({
      treatmentDollars: 0,
      coveragePercent: 50,
      remainingBenefitDollars: 1000,
    });
    expect(r.outOfPocketCents).toBe(0);
  });

  it('handles decimal inputs precisely', () => {
    const r = calculate({
      treatmentDollars: 1234.56,
      coveragePercent: 50,
      remainingBenefitDollars: 2000,
    });
    expect(r.treatmentCents).toBe(123456);
    expect(r.insuranceCoveredCents).toBe(61728);
    expect(r.outOfPocketCents).toBe(61728);
  });

  it('clamps negative coverage to 0', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: -50,
      remainingBenefitDollars: 2000,
    });
    expect(r.insuranceCoveredCents).toBe(0);
  });

  it('clamps coverage above 100 to 100', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 250,
      remainingBenefitDollars: 2000,
    });
    expect(r.insuranceCoveredCents).toBe(100000);
  });

  it('treats NaN inputs as zero', () => {
    const r = calculate({
      treatmentDollars: NaN,
      coveragePercent: NaN,
      remainingBenefitDollars: NaN,
    });
    expect(r.treatmentCents).toBe(0);
    expect(r.insuranceCoveredCents).toBe(0);
    expect(r.outOfPocketCents).toBe(0);
  });
});

describe('financing options', () => {
  // $600 out-of-pocket: 0% coverage, no benefit cap interaction
  const baseInputs = {
    treatmentDollars: 600,
    coveragePercent: 0,
    remainingBenefitDollars: 0,
  };

  it('pay-in-full has zero fee and one month', () => {
    const r = calculate(baseInputs);
    const payInFull = r.options.find((o) => o.plan.id === 'pay-in-full')!;
    expect(payInFull.totalCents).toBe(60000);
    expect(payInFull.monthlyPayments).toEqual([60000]);
  });

  it('3-month plan has zero fee', () => {
    const r = calculate(baseInputs);
    const threeMonth = r.options.find((o) => o.plan.id === '3-month')!;
    expect(threeMonth.totalCents).toBe(60000);
    expect(threeMonth.monthlyPayments).toEqual([20000, 20000, 20000]);
  });

  it('6-month plan applies 5% fee', () => {
    const r = calculate(baseInputs);
    const sixMonth = r.options.find((o) => o.plan.id === '6-month')!;
    expect(sixMonth.totalCents).toBe(63000);
    expect(sixMonth.monthlyPayments).toEqual([10500, 10500, 10500, 10500, 10500, 10500]);
  });

  it('12-month plan applies 10% fee', () => {
    const r = calculate(baseInputs);
    const twelve = r.options.find((o) => o.plan.id === '12-month')!;
    expect(twelve.totalCents).toBe(66000);
    expect(twelve.monthlyPayments.reduce((a, b) => a + b, 0)).toBe(66000);
  });

  it('residual goes on last payment so totals reconcile', () => {
    // $100 / 3 = $33.33...
    const r = calculate({
      treatmentDollars: 100,
      coveragePercent: 0,
      remainingBenefitDollars: 0,
    });
    const threeMonth = r.options.find((o) => o.plan.id === '3-month')!;
    expect(threeMonth.monthlyPayments).toEqual([3333, 3333, 3334]);
    expect(threeMonth.monthlyPayments.reduce((a, b) => a + b, 0)).toBe(10000);
  });

  it('all plans return a populated options array even when out-of-pocket is 0', () => {
    const r = calculate({
      treatmentDollars: 1000,
      coveragePercent: 100,
      remainingBenefitDollars: 2000,
    });
    expect(r.options).toHaveLength(4);
    r.options.forEach((o) => expect(o.totalCents).toBe(0));
  });
});

describe('formatUSD', () => {
  it('always shows exactly two decimal places', () => {
    expect(formatUSD(0 as Cents)).toBe('$0.00');
    expect(formatUSD(50000 as Cents)).toBe('$500.00');
    expect(formatUSD(50050 as Cents)).toBe('$500.50');
    expect(formatUSD(50055 as Cents)).toBe('$500.55');
  });

  it('inserts thousands separators', () => {
    expect(formatUSD(123456789 as Cents)).toBe('$1,234,567.89');
  });
});