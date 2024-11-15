import React, { Component } from 'react';
import axios from 'axios';
import './DishDashboard.css'; // Import CSS for styling

class DishDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: [],
            error: null
        };

        this.mediaBaseURL = 'http://localhost:8000/media/'; // Base URL for dish images
    }

    componentDidMount() {
        this.fetchDishes();
    }

    // Fetch dishes from the API
    fetchDishes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/dishes/'); // Replace with your API URL
            this.setState({ dishes: response.data });
        } catch (error) {
            console.error('Error fetching dishes:', error);
            this.setState({ error: 'Failed to load dishes' });
        }
    };

    render() {
        const { dishes, error } = this.state;

        return (
            <div className="dish-dashboard">
                <h1>Dishes</h1>
                {error && <p className="error">{error}</p>}

                <div className="dish-list">
                    {dishes.length > 0 ? (
                        dishes.map(dish => (
                            <div key={dish.id} className="dish-card">
                                <h2>{dish.name}</h2>
                                <p><strong>Category:</strong> {dish.category}</p>
                                <p><strong>Price:</strong> ${dish.price}</p>
                                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                                {dish.image && (
                                    <img
                                        src={`${this.mediaBaseURL}${dish.image}`}
                                        alt={dish.name}
                                        className="dish-image"
                                    />
                                )}
                                <p><strong>Description:</strong> {dish.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No dishes available</p>
                    )}
                </div>
            </div>
        );
    }
}

export default DishDashboard;
