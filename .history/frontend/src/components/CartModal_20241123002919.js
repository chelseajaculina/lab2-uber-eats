// src/components/CartModal.js
import React from 'react';
import './CartModal.css';


const CartModal = ({ cart, setCart, onClose }) => {
  const increaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === dishId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <h4>{item.name}</h4>
            <p>${(parseFloat(item.price) || 0).toFixed(2)}</p> {/* Ensures price is treated as a number */}
            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>x {item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total Amount: ${calculateTotal()}</h3>
      </div>
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button className="order-button">Order</button>
      </div>
    </div>
  );
};

export default CartModal;
