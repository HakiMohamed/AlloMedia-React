import React, { useEffect, useState } from 'react';

function VerifyEmail() {
  const [message, setMessage] = useState('Click the button to verify your email.');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Parse URL parameters without react-router
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please try again.');
    }
  }, []);  

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token missing.');
      return;
    }

    setStatus('loading');
    setMessage('Verifying your email...');

    try {
      const response = await fetch(`/api/verify-email?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        // Use setTimeout to simulate redirect
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error verifying email.');
    }
  };

  const statusIcons = {
    idle: (
      <svg className="h-16 w-16 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
    ),
    loading: (
      <svg className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    success: (
      <svg className="h-16 w-16 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    error: (
      <svg className="h-16 w-16 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div 
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 transition-colors duration-300">Email Verification</h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            {statusIcons[status]}
            <p className={`text-lg font-medium text-center ${
              status === 'success' ? 'text-green-600 dark:text-green-400' : 
              status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
            } transition-colors duration-300`}>
              {message}
            </p>
            {(status === 'idle' || status === 'error') && (
              <button
                onClick={verifyEmail}
                className="mt-4 px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-300"
              >
                Verify Email
              </button>
            )}
            {status === 'success' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse transition-colors duration-300">Redirecting to login page...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;