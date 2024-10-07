import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setMessage('Token not provided.');
    }
  }, [location.search]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully. You can now log in.');

        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage(data.message || 'Error resetting the password.');
      }
    } catch (err) {
      setMessage('Error resetting the password.');
    }

    setLoading(false);
  };

  return (
    <div className="font-[sans-serif] bg-gray-100 dark:bg-gray-900 min-h-screen">
      

      <div className="mx-4 mb-4 mt-16">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg sm:p-8 p-4 rounded-md">
          {message && <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 p-2 mb-4 rounded">{message}</div>}
          
          {!message && (
            <div className="grid gap-8">
              <div>
                <label className="text-gray-800 dark:text-gray-200 text-sm mb-2 block">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 focus:bg-transparent w-full text-sm text-gray-800 dark:text-gray-200 px-4 py-3 rounded-md outline-blue-500 transition-all"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <div>
                <label className="text-gray-800 dark:text-gray-200 text-sm mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 focus:bg-transparent w-full text-sm text-gray-800 dark:text-gray-200 px-4 py-3 rounded-md outline-blue-500 transition-all"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              {passwordError && <div className="text-red-500 dark:text-red-400 text-sm">{passwordError}</div>}

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md flex items-center justify-center w-full transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
                  </svg>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;