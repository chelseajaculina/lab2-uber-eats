import React, { useState, useEffect, useCallback } from 'react';
import './RestaurantDashboard.css';
import NavBarBusiness from './NavBarBusiness.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logo, setLogo] = useState(localStorage.getItem('restaurantProfilePicture'));
  const authToken = localStorage.getItem('access_token');
  const mediaBaseURL = 'http://localhost:8000/media/';

  const fetchRestaurantDetails = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/restaurants/me/', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const restaurantData = response.data;

      if (restaurantData.profile_picture) {
        const updatedLogo = `${mediaBaseURL}${restaurantData.profile_picture}`;
        setLogo(updatedLogo);
        localStorage.setItem('restaurantProfilePicture', updatedLogo);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  }, [authToken, mediaBaseURL]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = !!authToken;
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();

    if (authToken) {
      fetchRestaurantDetails();
    }
  }, [authToken, fetchRestaurantDetails]);

  return (
    <div className="home-container">
      {/* Navbar is always displayed */}
      <NavBarBusiness />

      <div className="banner-container">
        {/* Uncomment the line below if a banner image is available */}
        {/* <img src={banner} alt="Restaurant Banner" className="restaurant-banner" /> */}
        <div className="logo-container">
          <img src={logo} alt="Restaurant Logo" className="restaurant-logo" />
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-card">
          <h3>Profile Information</h3>
          <Link to="/restaurantprofile">
            <button className="promotion-button">View Profile</button>
          </Link>
        </div>
        <div className="promotion-card">
          <h3>Menu</h3>
          <Link to="/restaurantmenu">
            <button className="promotion-button">View Menu</button>
          </Link>
        </div>
        <div className="promotion-card">
          <h3>Orders</h3>
          <Link to="/orders">
            <button className="promotion-button">View Orders</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
