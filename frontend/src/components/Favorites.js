import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favorites.css';

const FavoritesTab = () => {
    const [favorites, setFavorites] = useState([]);

    // Fetch list of favorite restaurants on mount
    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Please log in to view your favorite restaurants.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/customers/favorites/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(response.data.map(fav => fav.restaurant));
            } catch (error) {
                console.error('Error fetching favorite restaurants:', error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="favorites-tab">
            <h2>Your Favorite Restaurants</h2>
            {favorites.length === 0 ? (
                <p>No favorite restaurants added yet.</p>
            ) : (
                <div className="favorite-restaurants">
                    {favorites.map((restaurant, index) => (
                        <div key={index} className="favorite-restaurant">
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.description}</p>
                            <p><strong>Location:</strong> {restaurant.location}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesTab;
