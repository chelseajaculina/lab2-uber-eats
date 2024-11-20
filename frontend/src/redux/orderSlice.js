import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    cart: [], // Array to hold cart items
    totalAmount: 0, // Total order amount
    address: '', // User's address
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity; // Increment quantity
      } else {
        state.cart.push(item); // Add new item to cart
      }

      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    updateAddress: (state, action) => {
      state.address = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalAmount = 0;
      state.address = '';
    },
  },
});

export const { addToCart, removeFromCart, updateAddress, clearCart } =
  orderSlice.actions;

export default orderSlice.reducer;
