import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/orderSlice';
import './CartModal.css';

const CartModal = ({ onClose, items = [] }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.order.cart || []); // Default to an empty array if undefined

  // Calculate the total price of the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Handle adding an item to the cart
  const handleAddToCart = (item) => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price }));
  };

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
      {/* Display cart items or show empty message */}
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
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
                <button onClick={() => handleAddToCart(item)}>+</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {/* Total amount section */}
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
      {/* Add items to cart from available products */}
      {items.length > 0 && (
        <div className="available-items">
          <h3>Available Items</h3>
          {items.map((item) => (
            <div className="item-card" key={item.id}>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartModal;
