// src/contexts/CartContext.js
import React, { createContext, useState } from 'react';

// Create the context
const CartContext = createContext();

// CartProvider component to wrap around components that need access to the cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a new item to the cart or update quantity if the item already exists
  const addToCart = (dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (dishId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== dishId));
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
