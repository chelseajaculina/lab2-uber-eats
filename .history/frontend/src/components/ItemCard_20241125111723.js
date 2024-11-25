import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/orderSlice';

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price }));
  };

  return (
    <div className="item-card">
      <h4>{item.name}</h4>
      <p>${item.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ItemCard;
