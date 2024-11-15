import React, { useState } from 'react';
import axios from 'axios';

const AddDishToMenu = ({ restaurantId }) => {
  const [dishData, setDishData] = useState({
    name: '',
    ingredients: '',
    category: '',
    price: '',
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setDishData({
      ...dishData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setDishData({
      ...dishData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('ingredients', dishData.ingredients);
    formData.append('category', dishData.category);
    formData.append('price', dishData.price);
    formData.append('restaurant', restaurantId);  // Attach the restaurant ID
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/add-dish/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Dish added successfully!');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to add the dish.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add a Dish to Your Menu</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Dish Name:</label>
          <input type="text" name="name" value={dishData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Ingredients:</label>
          <textarea name="ingredients" value={dishData.ingredients} onChange={handleChange} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={dishData.category} onChange={handleChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={dishData.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit">Add Dish</button>
      </form>
    </div>
  );
};

export default AddDishToMenu;
