import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderPage.css'; // Add custom CSS for styling

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
      try {
        const { data } = await axios.get('/api/session-data/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setCustomerId(data.customer_id);
        setRestaurantId(cart[0]?.restaurant_id || data.restaurant_id);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();

    if (!customerId) setCustomerId(localStorage.getItem('customer_id'));
    if (!restaurantId) setRestaurantId(localStorage.getItem('restaurant_id'));
  }, [cart, customerId, restaurantId]);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setSuccessMessage('');

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
      const response = await axios.post('/api/restaurants/orders/create/', orderPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Order placed successfully:', response.data);
      setIsOrderPlaced(true);
      setSuccessMessage('Your order has been placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h1>Place Order</h1>

      <div className="order-container">
        <div className="address-section">
          <h3> Add a new address:</h3>
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
            disabled={isLoading || !customerId || !restaurantId}
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
