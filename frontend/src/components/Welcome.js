import axios from 'axios';
import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../apiConfig';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.post(API_ENDPOINTS.VERIFY_USER, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      // Token is valid, allow access
      console.log('Token is valid:', response.data);
    })
    .catch(error => {
      console.error('Invalid token:', error);
      sessionStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  const handleLogout = () => {
    const token = sessionStorage.getItem('token');

    axios.post(API_ENDPOINTS.LOGOUT, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      // sessionStorage.removeItem('token');
      navigate('/login');
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };

  return (

    <div style={{ backgroundImage: `url('/assets/img/welcome.webp')` }} className='bg-cover bg-center min-h-screen w-full'>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h1 className="text-2xl font-bold mb-4">Welcome to the Portal</h1>
              <p className="mb-4">Congratulations! You have successfully logged in.</p>
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Welcome;
