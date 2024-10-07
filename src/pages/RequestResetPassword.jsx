import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const MAX_REQUESTS = 3;
  const COOLDOWN_TIME = 60; 
  const BLOCK_TIME = 15 * 60; 

  useEffect(() => {
    checkBlockStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const checkBlockStatus = () => {
    const blockData = JSON.parse(localStorage.getItem('passwordResetBlock') || '{}');
    const now = Date.now();

    if (blockData.blockUntil && now < blockData.blockUntil) {
      setIsBlocked(true);
      setCooldownTime(Math.ceil((blockData.blockUntil - now) / 1000));
    } else if (blockData.lastRequest && now - blockData.lastRequest < COOLDOWN_TIME * 1000) {
      setCooldownTime(Math.ceil((COOLDOWN_TIME * 1000 - (now - blockData.lastRequest)) / 1000));
    } else {
      setIsBlocked(false);
      setCooldownTime(0);
      localStorage.removeItem('passwordResetBlock');
    }
  };

  const updateRequestCount = () => {
    const now = Date.now();
    const blockData = JSON.parse(localStorage.getItem('passwordResetBlock') || '{}');
    const requests = blockData.requests || [];

    const recentRequests = requests.filter(timestamp => now - timestamp < BLOCK_TIME * 1000);
    recentRequests.push(now);

    if (recentRequests.length >= MAX_REQUESTS) {
      localStorage.setItem('passwordResetBlock', JSON.stringify({
        requests: recentRequests,
        blockUntil: now + BLOCK_TIME * 1000,
        lastRequest: now
      }));
      setIsBlocked(true);
      setCooldownTime(BLOCK_TIME);
    } else {
      localStorage.setItem('passwordResetBlock', JSON.stringify({
        requests: recentRequests,
        lastRequest: now
      }));
      setCooldownTime(COOLDOWN_TIME);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked || cooldownTime > 0) {
      setMessage({
        type: "error",
        text: `Please wait ${cooldownTime} seconds before making another request.`,
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch("/api/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "A password reset email has been sent." });
        updateRequestCount();
      } else {
        setMessage({ type: "error", text: data.message || "Error occurred while requesting password reset." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error occurred while requesting password reset." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-100 w-full dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md">
        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success" ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200" : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
    
        <form onSubmit={handleSubmit} className="space-y-6">
          <h4 className="text-xl text-gray-700 dark:text-white font-bold">Reset Your Password</h4>
    
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
    
          <button
            type="submit"
            disabled={isLoading || isBlocked || cooldownTime > 0}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition ${
              (isLoading || isBlocked || cooldownTime > 0) ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Sending...
              </span>
            ) : cooldownTime > 0 ? (
              `Wait ${cooldownTime}s before requesting again`
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            or <Link to="/" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Go Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;