import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../apiConfig';
import Loader from './Loader';


const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage('');

    
    if (!password.trim() || !confirmPassword.trim()) {
      setMessage('Password and Confirm Password are required');
      return;
    } else if (password.trim().length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }
    else if (password.trim() !== confirmPassword.trim()) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
      setMessage(response.data.message);
      navigate('/welcome');

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
              <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">
                  Reset Password
                </button>
              </form>
              {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
          </div>
      </div>
    </>

  );
};

export default ResetPassword;
