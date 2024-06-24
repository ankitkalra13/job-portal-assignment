import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_ENDPOINTS from '../apiConfig';
import Loader from './Loader';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Invalid email format');
      return;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    } else if (password.trim().length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    } else {
      setPasswordError('');
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.SIGNUP, { email, password });
      setMessage(response?.data.message);
      if (response?.data.status === 'Success') {
        setMessage('Verification email sent. Please check your email to verify.');
      }
    } catch (error) {
      setMessage(error.response?.data.message);
    }

    setLoading(false);
  };

  return (

    <>
      <Loader loading={loading} />
      <div style={{ backgroundImage: `url('/assets/img/bg.webp')` }} className='bg-cover bg-center min-h-screen w-full'>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative z-10 w-[400px] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
      <p className="mt-4">
        Already a user? <Link to="/login" className="text-blue-500">Login here</Link>
      </p>
          </div>
        </div>
      </div>
    </>

  );
};

export default Signup;
