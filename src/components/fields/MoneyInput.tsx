type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
};

export function MoneyInput({ id, label, value, onChange, hint }: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="money-input">
        <span aria-hidden="true">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          defaultValue={Number.isFinite(value) ? value : ''}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
          }}
        />
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}