import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');

  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('http://localhost:8000/api/customers/token/refresh/', {
      refresh: refresh_token,
    });

    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token) {
      alert('You are not logged in. Please log in to continue.');
      navigate('/login');
      return;
    }

    try {
      // Attempt to log out
      await axios.post(
        'http://localhost:8000/api/customers/logout/',
        { refresh: refresh_token },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Remove tokens from localStorage after a successful logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      alert('You have successfully logged out.');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);

      // If the access token has expired, try refreshing it
      if (error.response?.data?.detail === 'Given token not valid for any token type') {
        try {
          const newAccessToken = await refreshToken();
          await axios.post(
            'http://localhost:8000/api/customers/logout/',
            { refresh: refresh_token },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          // Remove tokens from localStorage after a successful logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          alert('You have successfully logged out.');
          navigate('/');
        } catch (refreshError) {
          console.error('Logout failed after token refresh:', refreshError);
          alert('Logout failed after token refresh. Please try again.');
        }
      } else {
        alert('Logout failed due to a network or server issue. Please try again.');
      }
    }
  };

  return (
    <center><button className="logout-button" onClick={handleLogout}> Sign out </button></center>
  );
};

export default Logout;