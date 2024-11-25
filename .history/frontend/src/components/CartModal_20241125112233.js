import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  // Get the cart state from Redux
  const cart = useSelector((state) => state.order.cart || []); // Default to empty array if undefined
  const dispatch = useDispatch();

  // Debugging: Log the cart state to verify its content
  console.log('Cart State:', cart);

  // Calculate the total price of the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle placing the order
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Order placed successfully!');
    dispatch(clearCart()); // Clear the cart after placing the order
    onClose(); // Close the modal
  };

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      {/* Display cart items */}
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                {/* Decrease quantity */}
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? dispatch(removeFromCart({ id: item.id }))
                      : dispatch(removeFromCart(item.id))
                  }
                >
                  -
                </button>
                <span>x {item.quantity}</span>
                {/* Increase quantity */}
                <button onClick={() => dispatch(addToCart(item))}>+</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {/* Total amount */}
      {cart.length > 0 && (
        <div className="cart-total">
          <h3>Total Amount: ${calculateTotal()}</h3>
        </div>
      )}
      {/* Actions */}
      <div className="cart-actions">
        <button onClick={onClose}>Close</button>
        <button
          className="order-button"
          onClick={handleOrder}
          disabled={cart.length === 0} // Disable if cart is empty
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
