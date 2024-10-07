import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';  
import AuthLayout from '../Components/AuthLayout';
import SocialButtons from '../Components/SocialButtons';
import Divider from '../Components/Divider';
import FormInput from '../Components/FormInput';
import SubmitButton from '../Components/SubmitButton';
import axios from 'axios';



function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
     
  }); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const validate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^\S+\s+\S+$/;
    
    if (!formData.name) {
      return "Name is required.";
    }
    if (!formData.name.match(namePattern)) {
      return "Please enter your firstname and lastname";
    }
    if (!formData.email.match(emailPattern)) {
      return "The email address is not valid.";
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    if(formData.phoneNumber){
    if (!/^\d+$/.test(formData.phoneNumber)) {
      return "Phone number must be numeric.";
    }
  }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validate();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);   
    try {
      const response = await axios.post('/api/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 201) {
        setSuccess(response.data.message);
        setError('');
        setLoading(false);  
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        console(response.data.errors[0].msg);
        setError(response.data.errors[0].msg); 
        setLoading(false); 
      }
    } catch (err) {
      console.log(err.response.data.errors[0].msg);
      setError('Error during registration. '+ err.response.data.errors[0].msg );
      setLoading(false); 
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <SocialButtons />
        <Divider />
        
        {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
        {success && <div className="bg-green-500 text-white p-2 mb-4">{success}</div>}
        
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
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
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />
        </div>

        <SubmitButton loading={loading}>Register</SubmitButton>

        <div className="mt-4 text-center">
          <p className="text-gray-800 dark:text-gray-200">
            Already have an account? <Link to="/login" className="text-blue-500 dark:text-blue-400 underline">Login here</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
