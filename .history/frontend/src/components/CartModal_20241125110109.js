import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  const cart = useSelector((state) => state.order.cart); // Access cart from Redux state
  const dispatch = useDispatch();

  // Calculate total price of the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle placing an order
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    alert('Order placed successfully!');
    dispatch(clearCart()); // Clear the cart after placing an order
    onClose(); // Close the modal
  };

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => dispatch(removeFromCart(item.id))}>-</button>
                <span>x {item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(addToCart({ ...item, quantity: item.quantity + 1 }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart-total">
          <h3>Total Amount: ${calculateTotal()}</h3>
        </div>
      )}
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button
          className="order-button"
          onClick={handleOrder}
          disabled={cart.length === 0} // Disable the button if the cart is empty
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
