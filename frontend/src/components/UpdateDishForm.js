import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateDishForm.css'; // CSS for styling

const UpdateDishForm = ({ dishId }) => {
  const [dishData, setDishData] = useState({
    name: '',
    description: '',
    ingredients: '',
    category: '',
    price: '',
    image: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch the dish information based on the dishId and prefill the form
    const fetchDishData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/dishes/${dishId}/`);
        setDishData(response.data);
      } catch (err) {
        setError('Failed to load dish data.');
      }
    };
    fetchDishData();
  }, [dishId]);

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
    formData.append('description', dishData.description);
    formData.append('ingredients', dishData.ingredients);
    formData.append('category', dishData.category);
    formData.append('price', dishData.price);
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    try {
      await axios.put(`http://localhost:8000/api/dishes/${dishId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Dish updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update the dish.');
    }
  };

  return (
    <div className="update-dish-form">
      <h2>Update Dish Information</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Dish Name:</label>
          <input type="text" name="name" value={dishData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" value={dishData.description} onChange={handleChange} />
        </div>

        <div>
          <label>Ingredients:</label>
          <textarea name="ingredients" value={dishData.ingredients} onChange={handleChange} required />
        </div>

        <div>
          <label>Select category:</label>
          <input type="text" name="category" value={dishData.category} onChange={handleChange} required />
        </div>

        <div>
          <label>Price:</label>
          <input type="number" name="price" value={dishData.price} onChange={handleChange} required />
        </div>

        <div>
          <label>Add dish image:</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>

        <button type="submit">Save new details</button>
      </form>
    </div>
  );
};

export default UpdateDishForm;
