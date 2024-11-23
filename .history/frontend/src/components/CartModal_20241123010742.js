import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Correctly import jwtDecode as a default export
import './CartModal.css';

const CartModal = ({ cart, setCart, onClose }) => {
  const navigate = useNavigate();

  // State for customer ID and restaurant ID
  const [customerId, setCustomerId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  // Extract customer ID and restaurant ID on component load
  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        console.log('Decoded Token:', decodedToken); // Log decoded token for debugging
        setCustomerId(decodedToken.customer_id || 'Not Found'); // Check for customer_id
      } catch (error) {
        console.error('Error decoding token:', error);
        setCustomerId('Error Decoding Token'); // Handle decoding error
      }
    } else {
      console.warn('Access token not found.');
      setCustomerId('Missing Token'); // Handle missing token
    }

    // Extract the restaurant ID from the cart
    if (cart.length > 0) {
      const uniqueRestaurantIds = [...new Set(cart.map((item) => item.restaurant_id))];
      console.log('Unique restaurant IDs from cart:', uniqueRestaurantIds);

      if (uniqueRestaurantIds.length === 1) {
        setRestaurantId(uniqueRestaurantIds[0]);
      } else if (uniqueRestaurantIds.length > 1) {
        setRestaurantId('Multiple IDs'); // Handle multiple IDs
      } else {
        setRestaurantId('None Found'); // Handle no IDs
      }
    } else {
      setRestaurantId('Empty Cart'); // Handle empty cart
    }
  }, [cart]);

  const increaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === dishId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () =>
    cart.reduce(
      (total, item) =>
        total + (parseFloat(item.price) || 0) * item.quantity,
      0
    ).toFixed(2);

  const handleOrder = () => {
    // Ensure both IDs are available before navigating
    if (!customerId || !restaurantId || customerId === 'Missing Token' || restaurantId === 'Empty Cart') {
      alert('Customer ID or Restaurant ID is missing. Please check your cart or log in.');
      return;
    }

    // Navigate to the Order Page with IDs and cart
    navigate('/order', {
      state: {
        cart,
        customerId,
        restaurantId,
      },
    });
  };

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      <p><strong>Customer ID:</strong> {customerId}</p>
      <p><strong>Restaurant ID:</strong> {restaurantId}</p>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <h4>{item.name}</h4>
            <p>${(parseFloat(item.price) || 0).toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>x {item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total Amount: ${calculateTotal()}</h3>
      </div>
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button className="order-button" onClick={handleOrder}>
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
