export default function Filters({ fields, values, onChange, onReset }) {
  return (
    <div className="filters">
      {fields.map((field) => (
        <label key={field.name} className="filter-item">
          <span>{field.label}</span>
          {field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={values[field.name] || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
            />
          ) : (
            <select
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            >
              <option value="">All</option>
              {field.options.map((opt) => (
                <option key={String(opt)} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </label>
      ))}
      <button className="btn btn-outline" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}