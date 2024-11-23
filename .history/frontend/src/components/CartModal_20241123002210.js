import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';

const CartModal = ({ cart, setCart, onClose, onLogout }) => {
  const navigate = useNavigate();

  // Extract the restaurant name from the cart (assuming all items are from the same restaurant)
  const restaurantName = cart[0]?.restaurant?.restaurant_name || '';

  // Increase item quantity
  const increaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === dishId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity and remove if quantity is 0
  const decreaseQuantity = (dishId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate the total price
  const calculateTotal = () =>
    cart
      .reduce(
        (total, item) =>
          total + (parseFloat(item.price) || 0) * item.quantity,
        0
      )
      .toFixed(2);

  // Navigate to the order page and pass the cart data
  const handleOrder = () => {
    navigate('/order', { state: { cart } });
  };

  // Clear the cart on logout
  const handleLogout = () => {
    setCart([]); // Clear the cart
    if (onLogout) onLogout(); // Execute any additional logout logic
    navigate('/login'); // Navigate to the login page
  };

  // Clear cart on component unmount (optional cleanup logic)
  useEffect(() => {
    return () => {
      console.log('CartModal unmounted. Cleaning up cart...');
      setCart([]);
    };
  }, [setCart]);

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      {restaurantName && <h3>Restaurant: {restaurantName}</h3>}
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <h4>{item.name}</h4>
            <p>${(parseFloat(item.price) || 0).toFixed(2)}</p>
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
        <button className="order-button" onClick={handleOrder}>
          Order
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default CartModal;
