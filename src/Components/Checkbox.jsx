// src/components/Checkbox.jsx
import React from 'react';

const Checkbox = ({ id, label, checked, onChange, className }) => {
  return (
    <div className={className}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-gray-600 dark:text-gray-400 text-sm">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;