import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartModal.css';

const CartModal = ({ cart, setCart, onClose }) => {
  const navigate = useNavigate();

  // State for customer ID and restaurant ID
  const [customerId, setCustomerId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  // Fetch customer ID from the backend
  useEffect(() => {
    const fetchCustomerId = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('Access token not found.');
        setCustomerId('Missing Token');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/customers/user-profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = response.data.id; // Assuming the response has an `id` field for customer ID
        console.log('Customer ID retrieved from backend:', userId);
        setCustomerId(userId);
      } catch (error) {
        console.error('Error fetching customer ID:', error.response?.data || error.message);
        setCustomerId('Error Fetching Customer ID');
      }
    };

    fetchCustomerId();
  }, []);

  // Extract the restaurant ID from the first item in the cart
  useEffect(() => {
    const extractRestaurantId = () => {
      console.log("Full Cart Data:", cart); // Debug the cart structure
      if (cart && cart.length > 0) {
        const firstItemRestaurantId = cart[0]?.restaurant_id; // Use optional chaining
        console.log("First item in the cart:", cart[0]); // Debug the first item in the cart
        console.log("Restaurant ID from first cart item:", firstItemRestaurantId);
        setRestaurantId(firstItemRestaurantId || "None Found");
      } else {
        setRestaurantId("Empty Cart"); // Handle empty cart
      }
    };
  
    extractRestaurantId();
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
      alert('Unable to proceed. Please ensure you are logged in and your cart contains valid items.');
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
      {!customerId ? (
        <p>Fetching Customer ID...</p>
      ) : (
        <p><strong>Customer ID:</strong> {customerId}</p>
      )}
      {!restaurantId ? (
        <p>Fetching Restaurant ID...</p>
      ) : (
        <p><strong>Restaurant ID:</strong> {restaurantId}</p>
      )}
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
