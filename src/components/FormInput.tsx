
import React from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  id?: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  error?: string;
  icon?: LucideIcon;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  step,
  placeholder,
  className = "",
  error,
  icon: Icon,
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="fitness-label block mb-2">
        {Icon && <Icon className="inline h-4 w-4 mr-2" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`fitness-input w-full ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
