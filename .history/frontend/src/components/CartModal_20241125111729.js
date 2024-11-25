import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  const cart = useSelector((state) => state.order.cart || []); // Default to empty array if undefined
  const dispatch = useDispatch();

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => dispatch(removeFromCart({ id: item.id }))}>-</button>
                <span>x {item.quantity}</span>
                <button onClick={() => dispatch(addToCart(item))}>+</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="cart-total">
        <h3>Total Amount: ${calculateTotal()}</h3>
      </div>
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button
          onClick={() => {
            alert('Order placed successfully!');
            dispatch(clearCart());
            onClose();
          }}
          disabled={cart.length === 0}
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
