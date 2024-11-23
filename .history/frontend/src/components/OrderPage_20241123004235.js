import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Import JWT decoding library
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [customerId, setCustomerId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setErrorMessage('User token is missing. Please log in.');
      navigate('/login');
      return;
    }

    // Decode the token to extract customer_id
    try {
      const decodedToken = jwtDecode(token);
      setCustomerId(decodedToken.customer_id); // Assume the backend encodes `customer_id` in the token
      console.log('Customer ID from token:', decodedToken.customer_id);
    } catch (error) {
      console.error('Error decoding token:', error.message);
      setErrorMessage('Invalid user token. Please log in again.');
      navigate('/login');
      return;
    }

    // Extract unique restaurant_id from cart
    if (cart.length > 0) {
      const uniqueRestaurantIds = [...new Set(cart.map((item) => item.restaurant.restaurant_id))];
      if (uniqueRestaurantIds.length === 1) {
        setRestaurantId(uniqueRestaurantIds[0]);
        console.log('Restaurant ID from cart:', uniqueRestaurantIds[0]);
      } else {
        setErrorMessage('Your cart contains items from multiple restaurants. Please update your cart.');
      }
    } else {
      setErrorMessage('Your cart is empty. Please add items to your cart.');
    }
  }, [cart, navigate]);

  return (
    <div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {/* Rest of the order page */}
    </div>
  );
};

export default OrderPage;
