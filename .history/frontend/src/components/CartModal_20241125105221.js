import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  const cart = useSelector((state) => state.order.cart);
  const dispatch = useDispatch();

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleOrder = () => {
    alert('Order placed successfully!');
    onClose();
  };

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <h4>{item.name}</h4>
            <p>${item.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
              <span>x {item.quantity}</span>
              <button onClick={() => dispatch(addToCart({ ...item, quantity: item.quantity + 1 }))}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total Amount: ${calculateTotal()}</h3>
      </div>
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button className="order-button" onClick={handleOrder}>
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
