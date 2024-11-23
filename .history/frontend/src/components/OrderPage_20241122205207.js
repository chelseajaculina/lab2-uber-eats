import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Extract the restaurant name from the cart
  const restaurantId = cart[0]?.restaurant_id || ''; // Assuming you have `restaurant_id` in the cart items

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/customers/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);
        } else {
          console.error('Failed to fetch addresses');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cart.map((item) => ({
        dish_id: item.id, // Assuming each item has `id` as the dish ID
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
          address: selectedAddress,
          items: orderItems,
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        setIsOrderPlaced(true);
      } else {
        console.error('Failed to place the order');
      }
    } catch (error) {
      console.error('Error placing the order:', error);
    }
  };

  return (
    <div className="order-page">
      <h1>Place Order</h1>
      <h2>Select Your Address</h2>
      <select
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
        className="address-dropdown"
      >
        <option value="" disabled>
          Select an address
        </option>
        {addresses.map((address, index) => (
          <option key={index} value={address.id}>
            {address.street}, {address.city}, {address.state}, {address.zipcode}
          </option>
        ))}
      </select>
      <h2>Or Add a New Address</h2>
      <form className="new-address-form">
        <input type="text" name="street" placeholder="eg. 1234 Main St" />
        <input type="text" name="apartment" placeholder="eg. Apartment, studio, or floor" />
        <input type="text" name="city" placeholder="eg. San Jose" />
        <input type="text" name="state" placeholder="eg. CA" />
        <input type="text" name="zipcode" placeholder="eg. 95111" />
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
            disabled={!selectedAddress}
          >
            Place Order
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
