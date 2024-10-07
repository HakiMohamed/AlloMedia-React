import React from 'react';

const SelectInput = ({ label, name, options, value, onChange, required = false, className = '', labelClassName = '' }) => {
  return (
    <div className="mb-4">
      <label className={labelClassName}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className={className}  
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
