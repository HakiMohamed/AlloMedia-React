
//src/pages/login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../Components/AuthLayout';
import SocialButtons from '../Components/SocialButtons';
import Divider from '../Components/Divider';
import FormInput from '../Components/FormInput';
import SubmitButton from '../Components/SubmitButton';
import Checkbox from '../Components/Checkbox'; 

import axios from 'axios';


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      
      const response = await axios.post('/api/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
     

      if (!response.data.status == 200) {
        console.log('------------------------response NooooT---------------------');

        console.log(response);

        console.log('------------------------response NooooT---------------------');

        if (response.data.errors[0].status === 403 && response.data.errors[0].msg.includes('OTP')) {
          localStorage.setItem('emailForOtp', formData.email);
          navigate('/otp-verification');  
        } else if (response.data.errors[0].status === 401) {
          setError('Invalid email or password');
        } else if (response.data.errors[0].status === 500) {
          setError('Server error. Please try again later.');  
        } else {
          setError(response.data.errors[0].msg || 'An error occurred.');
        }
      } else {
        console.log('------------------------response ok---------------------');
        console.log(response);
        console.log('------------------------response ok---------------------');

        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
      
    } catch (err) {
      console.log(err.response);  
      setError(err.response.data.message);
    }
    
    setLoading(false);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <SocialButtons />
        <Divider />
        {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
        <div className="grid gap-8">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
        <div className="mt-4 flex justify-between">
           <Checkbox
          id="rememberMe"
          label="Remember me"
          checked={rememberMe}
          onChange={handleCheckboxChange}
          className="flex items-center"
        />
          <Link to="/request-reset-password" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Forgot password?</Link>
        </div>
        <SubmitButton loading={loading}>Login</SubmitButton>
        <div className="mt-4 text-center">
          <p className="text-gray-800 dark:text-gray-200">
            Don't have an account? <Link to="/register" className="text-blue-500 dark:text-blue-400 underline">Register here</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
