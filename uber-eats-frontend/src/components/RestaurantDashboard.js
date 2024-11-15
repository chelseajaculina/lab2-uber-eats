import React from 'react';
import './RestaurantDashboard.css';
import NavBarBusiness from './NavBarBusiness.js'
import { Link } from 'react-router-dom';

// import Login from './Login';
//import {useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';

const RestaurantDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Simulate a login check
    const checkLoginStatus = () => {
      // Replace with actual login check logic
      const loggedIn = false; // Example: replace with actual login status
      setIsLoggedIn(loggedIn);
    };
  
    checkLoginStatus();
  }, []);

  return (
    <div className="home-container">
      {/* Show NavBar only if the user is not logged in */}
      {!isLoggedIn && (<NavBarBusiness/>)}

        {/* Restaurant Profile  */}
            <div className="promotions">
        <div className="promotion-card">
          <h3>Profile Information</h3>
         <Link to ="/restaurantprofile"> <button className="promotion-button">View Profile</button></Link>
        </div>
        <div className="promotion-card">
          <h3>Menu</h3>
          <Link to ="/dishdashboard">  <button className="promotion-button">View Menu</button> </Link>
        </div>
        <div className="promotion-card">
        <h3>Orders</h3> 
        <Link to ="/orders"> <button className="promotion-button">View Orders</button></Link>
        </div>
      </div>

    </div>


  );

  
};

export default RestaurantDashboard;