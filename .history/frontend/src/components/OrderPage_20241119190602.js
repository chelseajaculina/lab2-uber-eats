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

//   const handlePlaceOrder = () => {
//     // Simulate an API call to place the order
//     setTimeout(() => {
//       setIsOrderPlaced(true); // Set order placed to true
//     }, 1000); // Simulate delay for API call
//   };

const handlePlaceOrder = async () => {
    const orderData = {
      address: {
        line1: document.getElementById('address-line1').value,
        line2: document.getElementById('address-line2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
      },
      items: [
        { dish: 1, quantity: 2, price: 20.0 },
        { dish: 2, quantity: 1, price: 14.79 },
      ],
      customer: 'John Doe',
    };
  
    try {
      const response = await axios.post('/api/place-order/', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Order placed successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error placing order:', error.response.data);
    }
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
