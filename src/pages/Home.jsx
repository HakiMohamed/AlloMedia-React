import { useState, useEffect } from 'react';
import DynamicForm from '../Components/DynamicForm';

const Home = () => {

  

  const formFields = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox' },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select', 
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
      ]
    },
  ];

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 ease-in-out">
      <div className="max-w-md mx-auto pt-8 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Registration</h1>
          
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <DynamicForm fields={formFields} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Home;