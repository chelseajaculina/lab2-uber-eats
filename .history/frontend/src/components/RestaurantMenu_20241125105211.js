import React, { useState, useEffect } from 'react';
import './RestaurantMenu.css';
import NavBarBusiness from './NavBarBusiness';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null);
  const [dishData, setDishData] = useState({
    name: '',
    price: '',
    category: 'Appetizer',
    type: 'Veg',
    ingredients: '',
    description: '',
    image: null,
  });

  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurant.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleOpenModal = (dish = null) => {
    if (dish) {
      setEditingDishId(dish.id);
      setDishData({
        name: dish.name,
        price: dish.price,
        category: dish.category,
        type: dish.type,
        ingredients: dish.ingredients,
        description: dish.description,
        image: dish.image,
      });
    } else {
      setEditingDishId(null);
      setDishData({
        name: '',
        price: '',
        category: 'Appetizer',
        type: 'Veg',
        ingredients: '',
        description: '',
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDishData({
      name: '',
      price: '',
      category: 'Appetizer',
      type: 'Veg',
      ingredients: '',
      description: '',
      image: null,
    });
  };

  return (
    <div className="restaurant-menu">
      <NavBarBusiness />
      <h2 className="menu-title">Menu</h2>
      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
          </div>
        ))
      ) : (
        <p>No restaurants available</p>
      )}
      <div className="add-dish-section">
        <button className="add-dish-button" onClick={() => handleOpenModal()}>
          Add a new dish
        </button>
      </div>
    </div>
  );
};

export default RestaurantMenu;
