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
  const [customerId, setCustomerId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      console.log('Fetching session data...');
      try {
        const { data } = await axios.get('/api/session-data/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Session data fetched:', data);
        setCustomerId(data.customer_id); 
        setRestaurantId(cart[0]?.restaurant_id || data.restaurant_id);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }

      if (!customerId) {
        const fallbackCustomerId = localStorage.getItem('customer_id');
        console.log('Fallback customer ID from localStorage:', fallbackCustomerId);
        setCustomerId(fallbackCustomerId);
      }

      if (!restaurantId) {
        const fallbackRestaurantId = localStorage.getItem('restaurant_id');
        console.log('Fallback restaurant ID from localStorage:', fallbackRestaurantId);
        setRestaurantId(fallbackRestaurantId);
      }
    };

    fetchSessionData();
  }, [cart, customerId, restaurantId]);

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);
    console.log('Calculated total:', total);
    return total;
  };

  const validateAddressFields = () => {
    const isValid = street && city && state && zipcode;
    console.log('Address validation:', isValid ? 'Valid' : 'Invalid');
    if (!isValid) {
      console.warn('Invalid address fields:', { street, city, state, zipcode });
    }
    return isValid;
  };

  const handlePlaceOrder = async () => {
    console.log('Place Order button clicked');
    setIsLoading(true);
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

      console.log('Order payload:', {
        restaurant_id: restaurantId,
        customer_id: customerId,
        address: `${street}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zipcode}`,
        items: orderItems,
        total: calculateTotal(),
        status: 'New',
        delivery_status: 'Order Received',
      });

      const response = await axios.post(
        '/api/restaurants/orders/create/',
        {
          restaurant_id: restaurantId,
          customer_id: customerId,
          address: `${street}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zipcode}`,
          items: orderItems,
          total: calculateTotal(),
          status: 'New',
          delivery_status: 'Order Received',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Order created successfully:', response.data);
      setIsOrderPlaced(true);
      setSuccessMessage('Your order has been placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error placing the order:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h1>Place Order</h1>
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
