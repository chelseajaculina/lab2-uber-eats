import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state

  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Assuming the restaurant ID and customer details are part of the cart or user session
  const restaurantId = cart[0]?.restaurant_id || '';
  const customerId = localStorage.getItem('customer_id'); // Fetch customer ID from local storage or session

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!street || !city || !state || !zipcode) {
      setErrorMessage('Please fill in all required address fields.');
      setIsLoading(false);
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        dish_id: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          customer_id: customerId,
          address: `${street}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zipcode}`,
          items: orderItems,
          total: calculateTotal(),
          status: 'New', // Default status for new orders
          delivery_status: 'Order Received', // Default delivery status
        }),
      });

      if (response.ok) {
        setIsOrderPlaced(true);
        setSuccessMessage('Your order has been placed successfully!');
        setTimeout(() => {
          navigate('/'); // Redirect to the dashboard after a short delay
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing the order:', error);
      setErrorMessage('An error occurred while placing the order. Please try again.');
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
            disabled={isLoading}
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
          <button onClick={() => navigate('/')} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
