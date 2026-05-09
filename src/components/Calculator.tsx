import { useState } from 'react';
import { calculate } from '../domain/financing';
import {
  DEFAULT_TREATMENT_DOLLARS,
  DEFAULT_COVERAGE_PERCENT,
  DEFAULT_REMAINING_DOLLARS,
} from '../domain/config';
import { InputPanel } from './InputPanel';
import { ResultsPanel } from './ResultsPanel';
import { PaymentOptions } from './PaymentOptions';

export function Calculator() {
  const [treatmentDollars, setTreatment] = useState(DEFAULT_TREATMENT_DOLLARS);
  const [coveragePercent, setCoverage] = useState(DEFAULT_COVERAGE_PERCENT);
  const [remainingBenefitDollars, setBenefit] = useState(DEFAULT_REMAINING_DOLLARS);

  const result = calculate({
    treatmentDollars,
    coveragePercent,
    remainingBenefitDollars,
  });

  const rawInsuranceEstimateCents = Math.round(
    treatmentDollars * (coveragePercent / 100) * 100
  );
  const wasCapped = result.insuranceCoveredCents < rawInsuranceEstimateCents;

  return (
    <main className="calculator">
      <header className="calculator-header">
        <h1>Treatment Cost Estimate</h1>
      </header>
      <div className="calculator-body">
        <div className="input-column">
          <InputPanel
            treatmentDollars={treatmentDollars}
            coveragePercent={coveragePercent}
            remainingBenefitDollars={remainingBenefitDollars}
            onTreatmentChange={setTreatment}
            onCoverageChange={setCoverage}
            onBenefitChange={setBenefit}
          />
          <button onClick={() => window.print()} className="print-btn no-print">
            Print estimate
          </button>
        </div>
        <div className="output-column">
          <ResultsPanel result={result} />
          {wasCapped && (
            <p className="cap-note">
              Insurance capped at the remaining annual benefit.
            </p>
          )}
          <PaymentOptions result={result} />
        </div>
      </div>
    </main>
  );
}