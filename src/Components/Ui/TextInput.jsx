import React from 'react';

const TextInput = ({ label, name, value, onChange, required = false, type = 'text', className = '', labelClassName = '' }) => {
  return (
    <div className="mb-4">
      <label className={labelClassName}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className={className}  
      />
    </div>
  );
};

export default TextInput;
