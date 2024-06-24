import React, { useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../apiConfig';
import Loader from './Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setEmailError('');
    setMessage('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Invalid email format');
      return;
    } else {
      setEmailError('');
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.REQUEST_PASSWORD_RESET, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
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
              <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />
                {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">
                  Submit
                </button>
              </form>
              {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
          </div>
      </div>
    </>

  );
};

export default ForgotPassword;
