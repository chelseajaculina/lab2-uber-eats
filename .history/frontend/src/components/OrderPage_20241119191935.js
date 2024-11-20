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
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // Error message handling

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage(''); // Clear previous errors

    // Combine address from form inputs
    const address = `${newAddress.street}, ${newAddress.apartment}, ${newAddress.city}, ${newAddress.state}, ${newAddress.zipcode}`;

    // Prepare order data
    const orderData = {
      address: address,
      items: cart.map((item) => ({
        dish: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price) * item.quantity,
      })),
    };

    try {
      const response = await axios.post('place-order/', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Order placed successfully!');
      setIsOrderPlaced(true); // Mark the order as placed
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      setErrorMessage('Failed to place the order. Please try again.');
    }
  };

  return (
    <div className="order-page">
      <h3>Add your order address:</h3>
      <form className="new-address-form">
        <input
          type="text"
          name="street"
          placeholder="eg. 1234 Main St"
          value={newAddress.street}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="apartment"
          placeholder="eg. Apartment, studio, or floor"
          value={newAddress.apartment}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="eg. San Jose"
          value={newAddress.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="state"
          placeholder="eg. CA"
          value={newAddress.state}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="zipcode"
          placeholder="eg. 95111"
          value={newAddress.zipcode}
          onChange={handleInputChange}
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
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
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
