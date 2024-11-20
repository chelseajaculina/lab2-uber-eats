import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';
import axios from 'axios';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // State to track if the order is placed
  const [newAddress, setNewAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  });

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  // Fetch saved addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/customers/addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if needed
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
    // Combine selected or new address
    const address = selectedAddress
      ? selectedAddress
      : `${newAddress.line1}, ${newAddress.line2}, ${newAddress.city}, ${newAddress.state}, ${newAddress.zip}`;

    const orderData = {
      address: address,
      items: cart.map((item) => ({
        dish: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      customer: 'John Doe', // Replace with customer data if available
    };

    try {
      const response = await axios.post('/api/place-order/', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Order placed successfully!');
      console.log(response.data);
      setIsOrderPlaced(true); // Mark the order as placed
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="order-page">
      <h2>Select Address</h2>
      <select
        className="address-dropdown"
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
      >
        <option value="">Select an address</option>
        {addresses.map((address, index) => (
          <option key={index} value={address}>
            {address}
          </option>
        ))}
      </select>
      <h3>Don't see your address? Add a new address:</h3>
      <form className="new-address-form">
        <input
          type="text"
          name="line1"
          placeholder="eg. 1234 Main St"
          value={newAddress.line1}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="line2"
          placeholder="eg. Apartment, studio, or floor"
          value={newAddress.line2}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="city"
          placeholder="eg. San Jose"
          value={newAddress.city}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="state"
          placeholder="eg. CA"
          value={newAddress.state}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="zip"
          placeholder="eg. 95111"
          value={newAddress.zip}
          onChange={handleAddressChange}
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
          <button className="place-order-button" onClick={handlePlaceOrder}>
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
          <button onClick={() => navigate('/orders')} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
