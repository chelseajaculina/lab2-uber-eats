import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

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

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/customers/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if needed
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const addedAddress = `${newAddress.street}, ${newAddress.apartment}, ${newAddress.city}, ${newAddress.state}, ${newAddress.zipcode}`;
        setAddresses([...addresses, addedAddress]);
        setNewAddress({
          street: '',
          apartment: '',
          city: '',
          state: '',
          zipcode: '',
        });
      } else {
        console.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    const orderDetails = {
      customer: 'Customer Name', // Replace with dynamic customer retrieval
      restaurant_id: cart[0]?.restaurant_id, // Assuming cart has a valid restaurant ID
      dish_ids: cart.map((item) => item.id), // Extract dish IDs
      address: selectedAddress,
    };

    try {
      const response = await fetch('/create-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        setIsOrderPlaced(true);
      } else {
        console.error('Failed to place order');
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  };

  return (
    <div className="order-page">
      <h1>Place Order</h1>
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

      <h2>Add a New Address</h2>
      <form className="new-address-form" onSubmit={handleAddAddress}>
        <input
          type="text"
          name="street"
          placeholder="1234 Main St"
          value={newAddress.street}
          onChange={handleNewAddressChange}
          required
        />
        <input
          type="text"
          name="apartment"
          placeholder="Apartment, studio, or floor"
          value={newAddress.apartment}
          onChange={handleNewAddressChange}
        />
        <input
          type="text"
          name="city"
          placeholder="San Jose"
          value={newAddress.city}
          onChange={handleNewAddressChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="CA"
          value={newAddress.state}
          onChange={handleNewAddressChange}
          required
        />
        <input
          type="text"
          name="zipcode"
          placeholder="95111"
          value={newAddress.zipcode}
          onChange={handleNewAddressChange}
          required
        />
        <button type="submit">Add Address</button>
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
          <button className="place-order-button" onClick={handlePlaceOrder} disabled={!selectedAddress}>
            Place Order
          </button>
        )}
      </div>
      {isOrderPlaced && (
        <div className="confirmation-message">
          <h3>Congratulations!</h3>
          <p>
            Your order has been placed! Stay hungry, our delivery executive will be assigned shortly.
          </p>
          <button onClick={() => navigate('/or')} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
