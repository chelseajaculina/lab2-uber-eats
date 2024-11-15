import React, { useState, useEffect } from 'react';
import axios from 'axios';


const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get('http://localhost:8000/api/restaurants/dishes/');
                
                // Filter out any restaurant entries where the name is "adminr" or any other unwanted names
                const filteredRestaurants = response.data.filter(restaurant => restaurant.name.toLowerCase() !== 'adminr');

                setRestaurants(filteredRestaurants);
                setLoading(false);
            } catch (error) {
                setError('Error fetching restaurants');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="restaurant-list">
            {restaurants.map((restaurant) => (
                <div className="restaurant-card" key={restaurant.id}>
                    <img src={`http://localhost:8000/media/${restaurant.profile_picture}`} alt={restaurant.name} />
                    <h2>{restaurant.name}</h2>
                    <p><strong>Location:</strong> {restaurant.location}</p>
                    <p><strong>Description:</strong> {restaurant.description || 'No description available'}</p>
                    <p><strong>Contact:</strong> {restaurant.contact_info || 'No contact info available'}</p>
                    <p><strong>Timings:</strong> {restaurant.timings || 'No timings available'}</p>
                </div>
            ))}
        </div>
    );
};

export default RestaurantList;
