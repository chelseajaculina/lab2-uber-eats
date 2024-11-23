import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Wrap the cart initialization with useMemo to avoid unnecessary recalculations
  const cart = useMemo(() => location.state?.cart || [], [location.state]);

  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    // Retrieve customer ID and restaurant ID from session or backend
    const fetchSessionData = async () => {
      try {
        const { data } = await axios.get('/api/session-data/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setCustomerId(data.customer_id); // Set customer ID from session
        setRestaurantId(cart[0]?.restaurant_id || data.restaurant_id); // Set restaurant ID
      } catch (error) {
        console.error('Error fetching session data:', error);
        setErrorMessage('Failed to fetch session data. Please login again.');
      }
    };

    fetchSessionData();

    // Fallback to localStorage if session data fetch fails
    if (!customerId) setCustomerId(localStorage.getItem('customer_id'));
    if (!restaurantId) setRestaurantId(localStorage.getItem('restaurant_id'));
  }, [cart, customerId, restaurantId]);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  const validateAddressFields = () => {
    if (!street || !city || !state || !zipcode) {
      setErrorMessage('Please fill in all required address fields.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateAddressFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        dish_id: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        '/api/orders/create/',
        {
          restaurant_id: restaurantId,
          customer_id: customerId,
          address: `${street}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zipcode}`,
          items: orderItems,
          total: calculateTotal(),
          status: 'New', // Default status for new orders
          delivery_status: 'Order Received', // Default delivery status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setIsOrderPlaced(true);
      setSuccessMessage('Your order has been placed successfully!');
      setTimeout(() => {
        navigate('/orders'); // Redirect to the orders page
      }, 2000);
    } catch (error) {
      console.error('Error placing the order:', error);
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2>Add a new address:</h2>
      <form className="new-address-form">
        <input
          type="text"
          name="street"
          placeholder="eg. 1234 Main St"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          type="text"
          name="apartment"
          placeholder="eg. Apartment, studio, or floor"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />
        <input
          type="text"
          name="city"
          placeholder="eg. San Jose"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          name="state"
          placeholder="eg. CA"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          type="text"
          name="zipcode"
          placeholder="eg. 95111"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
      </form>
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
        {!isOrderPlaced && (
          <button
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={isLoading || !customerId || !restaurantId}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        )}
      </div>
      {isOrderPlaced && (
        <div className="confirmation-message">
          <h3>Congratulations!</h3>
          <p>
            Your order has been placed! Stay hungry, our delivery executive will
            be assigned shortly.
          </p>
          <button onClick={() => navigate('/orders')} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
