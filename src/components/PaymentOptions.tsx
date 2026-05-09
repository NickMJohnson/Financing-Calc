import { formatUSD } from '../domain/money';
import type { CalculatorResult } from '../domain/financing';

type Props = { result: CalculatorResult };

export function PaymentOptions({ result }: Props) {
  if (result.outOfPocketCents === 0) return null;

  return (
    <section className="payment-options" aria-label="Payment options">
      <h2>Payment options</h2>
      <div className="option-grid">
        {result.options.map((o) => {
          const monthly = o.monthlyPayments[0];
          const isPayInFull = o.plan.months === 1;
          const hasFee = o.plan.feeRate > 0;
          const feeText = `${(o.plan.feeRate * 100).toFixed(0)}% fee`;

          const metaText = isPayInFull
            ? 'Due today'
            : hasFee
              ? `${o.plan.months} months · ${feeText}`
              : `${o.plan.months} months`;

          return (
            <article key={o.plan.id} className="option-card">
              <h3>{o.plan.label}</h3>
              <div className="option-monthly">
                {isPayInFull ? (
                  formatUSD(o.totalCents)
                ) : (
                  <>
                    {formatUSD(monthly)}
                    <span className="option-mo"> /mo</span>
                  </>
                )}
              </div>
              <div className="option-meta">{metaText}</div>
              <div className="option-total">Total: {formatUSD(o.totalCents)}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}