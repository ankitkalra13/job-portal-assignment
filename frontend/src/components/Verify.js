import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_ENDPOINTS from '../apiConfig';


const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      // Send POST request with token in the body
      axios.post(API_ENDPOINTS.VERIFY_TOKEN, { token })
        .then(response => {
          sessionStorage.setItem('token', token);
          setMessage(response.data.message);
          navigate('/welcome'); // Redirect to welcome page if verification is successful
        })
        .catch(error => {
          setMessage(error.response.data.message);
        });
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Verify Email</h1>
      {message && <p className="text-lg">{message}</p>}
    </div>
  );
};

export default Verify;
