import React from 'react';

const CheckboxInput = ({ label, name, checked, onChange, className, labelClassName }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked)}
        className={className}  
      />
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
