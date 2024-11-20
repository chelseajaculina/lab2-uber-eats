import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, totalAmount } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/order-summary');
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3>
      <button onClick={handleOrder}>Order</button>
    </div>
  );
};

export default Cart;
