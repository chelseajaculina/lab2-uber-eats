import React, { useState } from 'react';
import axios from 'axios';

const OrderPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const orderData = {
      restaurant_id: "2",
      customer_id: "1",
      address: "888 San Jose State University, CA 99999",
      status: "New",
      delivery_status: "Order Received",
      items: [
        {
          dish_id: "3",
          quantity: 2,
        },
        {
          dish_id: "4",
          quantity: 1,
        },
      ],
    };

    try {
      console.log('Placing order with data:', orderData);

      const response = await axios.post('/api/restaurants/orders/create/', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Order placed successfully:', response.data);
      setSuccessMessage('Your order has been placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while placing the order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Place Order</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default PlaceOrder;
