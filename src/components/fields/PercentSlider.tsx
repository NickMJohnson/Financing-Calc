type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
};

export function PercentSlider({ id, label, value, onChange }: Props) {
  const handle = (n: number) =>
    onChange(Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="slider-row" style={{ ['--coverage' as string]: value }}>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(e) => handle(parseFloat(e.target.value))}
        />
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(e) => handle(parseFloat(e.target.value))}
          aria-label={`${label} numeric input`}
        />
        <span aria-hidden="true">%</span>
      </div>
    </div>
  );
}