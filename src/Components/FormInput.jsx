import React from 'react';

const FormInput = ({ label, type, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="text-gray-800 dark:text-gray-200 text-sm mb-2 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-gray-100 dark:bg-gray-700 focus:bg-transparent dark:focus:bg-gray-600 w-full text-sm text-gray-800 dark:text-gray-200 px-4 py-3 rounded-md outline-blue-500 transition-all"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default FormInput;