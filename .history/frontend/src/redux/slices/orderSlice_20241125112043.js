import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        state.cart = state.cart.filter((item) => item.id !== action.payload.id);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = orderSlice.actions;
export default orderSlice.reducer;
