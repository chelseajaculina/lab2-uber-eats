import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddress, clearCart } from '../redux/orderSlice';

const OrderSummary = () => {
  const { cart, totalAmount, address } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [newAddress, setNewAddress] = useState(address);

  const handleSubmit = () => {
    dispatch(updateAddress(newAddress));
    alert('Order placed successfully!');
    dispatch(clearCart());
  };

  return (
    <div>
      <h1>Select Address</h1>
      <input
        type="text"
        placeholder="Enter Address"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <h2>Order Summary</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} Qty: {item.quantity} ${item.price}
          </li>
        ))}
      </ul>
      <h3>Total: ${totalAmount}</h3>
      <button onClick={handleSubmit}>Place Order</button>
    </div>
  );
};

export default OrderSummary;
