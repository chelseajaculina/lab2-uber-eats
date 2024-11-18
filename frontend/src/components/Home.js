import React, { useState, useEffect } from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState({});

  // Fetch restaurant data from Django API
  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants/restaurants/list/')
      .then(response => {
        console.log("API Response:", response.data);

        // Filter out restaurants with the name "adminr"
        const filteredRestaurants = response.data.filter(item => item.restaurant.restaurant_name.toLowerCase() !== 'adminr');

        setRestaurants(filteredRestaurants);
      })
      .catch(error => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteRestaurants')) || {};
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite status and save to localStorage
  const toggleFavorite = (restaurantId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = {
        ...prevFavorites,
        [restaurantId]: !prevFavorites[restaurantId],
      };
      localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <div className="home-container">
      <NavBarHome />

      {/* Categories Section */}
      <div className="categories-scroll">
        {["Grocery", "Fast Food", "Pizza", "Mexican", "Wings", "Ice Cream", "Burgers", "Indian", "Chinese", "Desserts", "Thai", "Asian", "Italian", "Breakfast", "Bubble Tea"].map((category) => (
          <div key={category} className="category-item">
            <img src={`${process.env.PUBLIC_URL}/images/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* Promotions Section */}
      <div className="promotions">
        <div className="promotion-card">
          <h3>$0 Delivery Fee + up to 10% off with Uber One</h3>
          <button className="promotion-button">Try free for 4 weeks</button>
        </div>
        <div className="promotion-card">
          <h3>$15 off when you invite your friends</h3>
          <button className="promotion-button">Invite & earn</button>
        </div>
        <div className="promotion-card">
          <h3>Check out gameday deals</h3>
          <button className="promotion-button">Shop deals</button>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="restaurants-section">
        <h2>Restaurants</h2>
        <div className="restaurants-list">
          {restaurants.map((item, index) => (
            <div key={index} className="restaurant-card">
              {/* Image Container with Favorite Icon */}
              <div className="image-container">
                <img 
                  src={item.restaurant.profile_picture ? `http://localhost:8000/media/${item.restaurant.profile_picture}` : `${process.env.PUBLIC_URL}/images/default-restaurant.jpg`} 
                  alt={item.restaurant.restaurant_name} 
                  className="restaurant-image"
                />
                <button 
                  className="favorite-icon" 
                  onClick={() => toggleFavorite(item.restaurant.id)}
                >
                  {favorites[item.restaurant.id] ? <FaHeart className="heart-icon filled" /> : <FaRegHeart className="heart-icon" />}
                </button>
              </div>

              {/* Restaurant Details */}
              <div className="restaurant-details">
                <h3>
                  <Link to={`/brands/${item.restaurant.restaurant_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                    {item.restaurant.restaurant_name}
                  </Link>
                </h3>
                <p><strong>Location:</strong> {item.restaurant.location}</p>
                <p><strong>Description:</strong> {item.restaurant.description || "No description available"}</p>
                <p><strong>Contact:</strong> {item.restaurant.contact_info || "No contact info available"}</p>
                <p><strong>Timings:</strong> {item.restaurant.timings || "No timings available"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
