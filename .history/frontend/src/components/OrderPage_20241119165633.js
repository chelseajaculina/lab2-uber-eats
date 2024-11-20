import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state
  const [addresses, setAddresses] = useState([]); // State for saved addresses
  const [selectedAddress, setSelectedAddress] = useState(''); // State for the selected address

  // Function to calculate total amount
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
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if needed for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses); // Assuming the API returns an object with an 'addresses' array
        } else {
          console.error('Failed to fetch addresses');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

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
        <input type="text" name="street" placeholder="eg. 1234 Main St" />
        <input type="text" name="apartment" placeholder="eg. Apartment, studio, or floor" />
        <input type="text" name="city" placeholder="eg. San Jose" />
        <input type="text" name="state" placeholder="eg. CA" />
        <input type="text" name="zipcode" placeholder="eg. 95111" />
        {/* <button type="submit">Submit</button> */}
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
        <button className="place-order-button">Place Order</button>
      </div>
    </div>
  );
};

export default OrderPage;
