import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Vérification de votre e-mail en cours...');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyEmail(tokenFromUrl);
    } else {
      setStatus('error');
      setMessage('Lien de vérification invalide. Veuillez réessayer ou demander un nouveau lien.');
    }
  }, [location.search]);  

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`/api/verify-email?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage('Votre e-mail a été vérifié avec succès!');
        setTimeout(() => navigate('/login'), 3000); 
      } else {
        setStatus('error');
        setMessage(data.message || 'Échec de la vérification de l\'e-mail.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Erreur lors de la vérification de l\'e-mail.');
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setMessage('Veuillez entrer votre adresse e-mail.');
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Un nouveau lien de vérification a été envoyé. Veuillez vérifier votre boîte de réception.');
      } else {
        setMessage(data.message || 'Erreur lors de l\'envoi du lien de vérification.');
      }
    } catch (err) {
      setMessage('Erreur lors de l\'envoi du lien de vérification.');
    } finally {
      setResendLoading(false);
    }
  };

  const statusIcons = {
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
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 transition-colors duration-300">Vérification de l'E-mail</h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            {statusIcons[status]}
            <p className={`text-lg font-medium text-center ${
              status === 'success' ? 'text-green-600 dark:text-green-400' : 
              status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
            } transition-colors duration-300`}>
              {message}
            </p>
            {status === 'error' && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse e-mail"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={resendVerificationEmail}
                  disabled={resendLoading}
                  className="mt-4 px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-300 disabled:opacity-50"
                >
                  {resendLoading ? 'Envoi en cours...' : 'Renvoyer le lien de vérification'}
                </button>
              </>
            )}
            {status === 'success' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse transition-colors duration-300">Redirection vers la page de connexion...</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;