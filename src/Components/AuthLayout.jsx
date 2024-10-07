import React from 'react';

const AuthLayout = ({ children }) => (
  <div className="font-[sans-serif] dark:bg-gray-900">
    <div className="mx-4 mb-4 mt-10 mb-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg sm:p-8 p-4 rounded-md">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;