import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose }) => {
  // Get cart data from the Redux store
  const cart = useSelector((state) => state.order.cart);
  const dispatch = useDispatch();

  // Calculate the total price of the items in the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle the order placement logic
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
      {/* Display cart items or show empty message */}
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                {/* Decrease item quantity or remove if quantity is 1 */}
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? dispatch(removeFromCart({ ...item, quantity: item.quantity - 1 }))
                      : dispatch(removeFromCart(item.id))
                  }
                >
                  -
                </button>
                <span>x {item.quantity}</span>
                {/* Increase item quantity */}
                <button onClick={() => dispatch(addToCart(item))}>+</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {/* Show total amount if cart is not empty */}
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
          disabled={cart.length === 0} // Disable order button if cart is empty
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CartModal;
