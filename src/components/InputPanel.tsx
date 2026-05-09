import { MoneyInput } from './fields/MoneyInput';
import { PercentSlider } from './fields/PercentSlider';

type Props = {
  treatmentDollars: number;
  coveragePercent: number;
  remainingBenefitDollars: number;
  onTreatmentChange: (v: number) => void;
  onCoverageChange: (v: number) => void;
  onBenefitChange: (v: number) => void;
};

export function InputPanel(p: Props) {
  return (
    <section className="input-panel" aria-label="Treatment and insurance details">
      <h2>Treatment details</h2>
      <div className="input-panel-fields">
        <MoneyInput
          id="treatment"
          label="Treatment cost"
          value={p.treatmentDollars}
          onChange={p.onTreatmentChange}
        />
        <PercentSlider
          id="coverage"
          label="Insurance coverage"
          value={p.coveragePercent}
          onChange={p.onCoverageChange}
        />
        <MoneyInput
          id="benefit"
          label="Remaining annual benefit"
          value={p.remainingBenefitDollars}
          onChange={p.onBenefitChange}
          hint="From your insurance plan"
        />
      </div>
    </section>
  );
}