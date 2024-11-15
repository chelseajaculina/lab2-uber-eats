import React from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';

// import Login from './Login';
//import {useNavigate } from 'react-router-dom';

import { useState } from 'react';

const Home = () => {
  const [isLoggedIn] = useState(false);

  return (
    <div className="home-container">
      {/* Show NavBar only if the user is not logged in */}
      {!isLoggedIn && (<NavBarHome />)}


      {/* Categories Section */}
      <div className="categories-scroll">
        {["Grocery", "Breakfast","Fast Food", "Burgers", "Pizza", "Mexican", "Wings", "Dessert", "Sushi", "BubbleTea"].map((category) => (
          <div key={category} className="category-item">
            <img src={`${process.env.PUBLIC_URL}/images/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </div>

        {/* Promotions Section */}
            <div className="promotions">
        <div className="promotion-card">
          <h3>$15 off when you invite your friends</h3>
          <button className="promotion-button">Invite & earn</button>
        </div>
        <div className="promotion-card">
          <h3>$0 Delivery Fee + up to 10% off with Uber One</h3>
          <button className="promotion-button">Try free for 4 weeks</button>
        </div>
        <div className="promotion-card">
          <h3>Check out gameday deals</h3>
          <button className="promotion-button">Shop deals</button>
        </div>
      </div>

      {/* National Brands Section */}
      <div className="brands-section">
        <h2>Restaurants</h2>
        <div className="brands">
          {[
            { name: "McDonald's", deliveryFee: "Higher Delivery Fee", time: "20-35 min", rating: 4.5 },
            { name: "Jack in the Box", deliveryFee: "Low Delivery Fee", time: "10-20 min", rating: 4.5 },
            { name: "Panda Express", deliveryFee: "Moderate Delivery Fee", time: "15-30 min", rating: 4.5 },
            { name: "Wingstop", deliveryFee: "Moderate Delivery Fee", time: "10-25 min", rating: 4.6 },
            { name: "Taco Bell", deliveryFee: "Moderate Delivery Fee", time: "10-25 min", rating: 4.6 },
          ].map((brand) => (
            <div key={brand.name} className="brand-card">
              {/* <img src={process.env.PUBLIC_URL + /images/${brand.name.toLowerCase().replace(' ','-').replace('', '').replace('.', '')}.jpeg} alt={brand.name} /> */}
<img src={
  `${process.env.PUBLIC_URL}/images/${brand.name
      .toLowerCase()
      .replace(/\s+/g, '-')   // Replace all spaces with dashes
      .replace(/[^a-z0-9-]/g, '')  // Remove all characters except lowercase letters, numbers, and dashes
  }.jpeg`
}
alt={brand.name}
/>



              <h3>{brand.name}</h3>
              <p>{brand.deliveryFee} • {brand.time}</p>
              <p>Rating: {brand.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    
  );

  
};

export default Home;