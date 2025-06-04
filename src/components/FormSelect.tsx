
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  error,
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={selectId} className="fitness-label block mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        required={required}
        className={`fitness-input w-full ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormSelect;
