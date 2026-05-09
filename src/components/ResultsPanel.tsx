import { formatUSD } from '../domain/money';
import type { CalculatorResult } from '../domain/financing';

type Props = { result: CalculatorResult };

export function ResultsPanel({ result }: Props) {
  return (
    <section className="results-panel" aria-label="Cost breakdown">
      <div className="result-row">
        <div className="result-label">Insurance pays</div>
        <div className="result-value">{formatUSD(result.insuranceCoveredCents)}</div>
      </div>
      <div className="result-row patient-row">
        <div className="result-label">You pay</div>
        <div className="result-value">{formatUSD(result.outOfPocketCents)}</div>
      </div>
    </section>
  );
}