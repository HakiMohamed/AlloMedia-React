import React, { useState } from 'react';
import TextInput from '../Components/Ui/TextInput';  
import SelectInput from '../Components/Ui/SelectInput';  
import CheckboxInput from '../Components/Ui/CheckboxInput'; 
import Button from '../Components/Ui/Button'; 

const DynamicForm = ({ fields, onSubmit, buttonText,buttonClassName  }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <TextInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={field.className}  
            labelClassName={field.labelClassName}  
          />
        );
      case 'checkbox':
        return (
          <CheckboxInput
            key={field.name}
            label={field.label}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
            className={field.className}  
            labelClassName={field.labelClassName}  
          />
        );
      case 'select':
        return (
          <SelectInput
            key={field.name}
            label={field.label}
            name={field.name}
            options={field.options}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={field.className}  
            labelClassName={field.labelClassName}  
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(renderField)}
      <Button
        text={buttonText}
        className={buttonClassName}  
      />
    </form>
  );
};

export default DynamicForm;
