import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("We detected a login attempt from a new device. Please enter the OTP sent to your email ");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); 
  const [countdown, setCountdown] = useState(5);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const MAX_RESEND_ATTEMPTS = 3;
  const RESEND_COOLDOWN_TIME = 60; 
  const BLOCK_TIME = 10 * 60; 

  useEffect(() => {
    inputRefs.current[0].focus();
    checkResendStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0 && success) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      navigate('/login'); 
    }
    return () => clearInterval(timer);
  }, [countdown, success, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const checkResendStatus = () => {
    const resendData = JSON.parse(localStorage.getItem('otpResendData') || '{}');
    const now = Date.now();

    if (resendData.blockUntil && now < resendData.blockUntil) {
      setResendCooldown(Math.ceil((resendData.blockUntil - now) / 1000));
    } else if (resendData.lastResend && now - resendData.lastResend < RESEND_COOLDOWN_TIME * 1000) {
      setResendCooldown(Math.ceil((RESEND_COOLDOWN_TIME * 1000 - (now - resendData.lastResend)) / 1000));
    }
  };

  const updateResendAttempts = () => {
    const now = Date.now();
    const resendData = JSON.parse(localStorage.getItem('otpResendData') || '{}');
    const attempts = resendData.attempts || [];

    const recentAttempts = attempts.filter(timestamp => now - timestamp < BLOCK_TIME * 1000);
    recentAttempts.push(now);

    if (recentAttempts.length >= MAX_RESEND_ATTEMPTS) {
      localStorage.setItem('otpResendData', JSON.stringify({
        attempts: recentAttempts,
        blockUntil: now + BLOCK_TIME * 1000,
        lastResend: now
      }));
      setResendCooldown(BLOCK_TIME);
    } else {
      localStorage.setItem('otpResendData', JSON.stringify({
        attempts: recentAttempts,
        lastResend: now
      }));
      setResendCooldown(RESEND_COOLDOWN_TIME);
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setMessage("Please complete the 6-digit OTP.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('emailForOtp'), otp: otpValue }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('token', data.token);
        setMessage("OTP Verified Successfully. Redirecting...");
        setStatus("success");
      } else {
        setMessage(data.message || "Invalid OTP");
        setStatus("error");
      }
    } catch (err) {
      setMessage("Error during OTP verification.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) {
      setMessage(`Please wait ${resendCooldown} seconds before requesting a new OTP.`);
      setStatus('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setStatus('');
  
    const email = localStorage.getItem('emailForOtp'); 
  
    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        updateResendAttempts();
        setMessage(data.message);
        setStatus('success');
      } else {
        setMessage(data.message || 'Error resending OTP');
        setStatus('error');
      }
    } catch (err) {
      setMessage('Error during OTP resend.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">OTP Verification</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold text-gray-700 dark:text-white bg-white dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          disabled={loading || otp.some((digit) => digit === "")}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-md transform hover:scale-105"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && status && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center justify-center ${
              status === "success" 
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" 
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
            }`}
            role="alert"
          >
            {status === "success" ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaTimesCircle className="mr-2" />
            )}
            {message}
          </div>
        )}

        {success && (
          <div className="mt-4 text-center text-green-700 dark:text-green-400">
            Redirecting in {countdown} seconds...
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className={`w-full mt-4 ${
            resendCooldown > 0
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          } transition-colors duration-300 focus:outline-none`}
        >
          {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;