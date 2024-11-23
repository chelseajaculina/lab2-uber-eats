import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useMemo(() => location.state?.cart || [], [location.state]);

  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customerId, setCustomerId] = useState(localStorage.getItem('customer_id') || null);
  const [restaurantId, setRestaurantId] = useState(null);

  // Extract Restaurant ID from Cart Dishes
  useEffect(() => {
    if (cart.length > 0) {
      const uniqueRestaurantIds = [...new Set(cart.map((item) => item.restaurant_id))];
      console.log('Unique restaurant IDs from cart:', uniqueRestaurantIds);

      if (uniqueRestaurantIds.length === 1) {
        setRestaurantId(uniqueRestaurantIds[0]);
        console.log('Restaurant ID set from cart:', uniqueRestaurantIds[0]);
      } else if (uniqueRestaurantIds.length > 1) {
        setErrorMessage('Your cart contains items from multiple restaurants. Please update your cart.');
        console.warn('Multiple restaurant IDs detected:', uniqueRestaurantIds);
      } else {
        setErrorMessage('Restaurant ID is missing. Please check your cart.');
        console.warn('No restaurant_id found in the cart items.');
      }
    } else {
      setErrorMessage('Your cart is empty. Please add items to your cart.');
      console.warn('Cart is empty.');
    }
  }, [cart]);

  const calculateTotal = () => {
    const total = cart.reduce(
      (total, item) => total + (parseFloat(item.price) || 0) * item.quantity,
      0
    ).toFixed(2);
    console.log('Calculated total price:', total);
    return total;
  };

  const validateAddressFields = () => {
    if (!street || !city || !state || !zipcode) {
      setErrorMessage('Please fill in all required address fields.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateAddressFields()) {
      setIsLoading(false);
      return;
    }

    if (!customerId || !restaurantId) {
      setErrorMessage('Customer ID or Restaurant ID is missing. Please check your cart or log in.');
      setIsLoading(false);
      return;
    }

    const orderItems = cart.map((item) => ({
      dish_id: item.id,
      quantity: item.quantity,
    }));

    const orderPayload = {
      restaurant_id: restaurantId,
      customer_id: customerId,
      address: `${street}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zipcode}`,
      items: orderItems,
      total: calculateTotal(),
      status: 'New',
      delivery_status: 'Order Received',
    };

    try {
      console.group('Order Submission');
      console.log('Order payload:', orderPayload);

      const token = localStorage.getItem('access_token');
      const response = await axios.post('/api/restaurants/orders/create/', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Order response:', response.data);
      setIsOrderPlaced(true);
      setSuccessMessage('Your order has been placed successfully!');
      console.groupEnd();
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while placing the order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h1>Place Order</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="order-container">
        <div className="address-section">
          <h3>Add a new address:</h3>
          <form className="new-address-form">
            <div className="address-input">
              <input
                type="text"
                placeholder="eg. 1234 Main St"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <input
                type="text"
                placeholder="eg. Apartment, studio, or floor"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
            <div className="address-input">
              <input
                type="text"
                placeholder="eg. San Jose"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="eg. CA"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <input
                type="text"
                placeholder="eg. 95111"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <h3>Total: ${calculateTotal()}</h3>
          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={isLoading || !cart.length}
          >
            {isLoading ? 'Placing Order...' : 'Submit'}
          </button>
        </div>
      </div>

      {isOrderPlaced && (
        <div className="confirmation-message">
          <h3>Congratulations!</h3>
          <p>Your order has been placed! Stay hungry, our delivery executive will be assigned shortly.</p>
          <button onClick={() => navigate('/orders')} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
