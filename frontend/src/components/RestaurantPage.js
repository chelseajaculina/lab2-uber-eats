import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import NavBarHome from './NavBarHome';
import CartModal from './CartModal';

const RestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { restaurantName } = useParams();

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName.toLowerCase()}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRestaurant(response.data.restaurant);
                setDishes(response.data.dishes);
                setLoading(false);
            } catch (error) {
                setError('Error fetching restaurant data');
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [restaurantName]);

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

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!restaurant) return <div>No restaurant data found</div>;

    return (
        <div className="restaurant-page">
            <NavBarHome />

            <div className="navbar-cart" style={{ position: 'absolute', top: '20px', right: '20px' }}>
    <button
        className="view-cart-button"
        onClick={() => setIsCartOpen(true)}
        style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
            style={{ marginRight: '10px' }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2m4.6 0h9l1 6h-14l1.3-6zm10.9 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-11 0a 2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            />
        </svg>
        View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
    </button>
</div>
            <div className="restaurant-header">
                <img 
                    src={`http://localhost:8000/media/${restaurant.profile_picture}`} 
                    alt={restaurant.restaurant_name} 
                    className="restaurant-logo" 
                />
                <div className="restaurant-details">
                    <b><h1>{restaurant.restaurant_name}</h1></b>
                    <p>{restaurant.description}</p>
                    <p><strong>Location: </strong>{restaurant.location}</p>
                    <p><strong>Contact Info: </strong>{restaurant.contact_info}</p>
                    <p><strong>Timings: </strong>{restaurant.timings}</p>
                </div>
            </div>

            <h3>Featured Items</h3>
            <div className="dish-list">
                {dishes.map(dish => (
                    <div className="dish-card" key={dish.id}>
                        <img 
                            src={`http://localhost:8000/${dish.image}`} 
                            alt={dish.name} 
                            className="dish-image" 
                        />
                        <h3>{dish.name}</h3>
                        <p>{dish.description}</p>
                        <p><strong>${isNaN(Number(dish.price)) ? 'N/A' : Number(dish.price).toFixed(2)}</strong></p>
                        <button className="add-to-cart-button" onClick={() => addToCart(dish)}>Add to Cart</button>
                    </div>
                ))}
            </div>
{/* 
            <button
    className="view-cart-button"
    onClick={() => setIsCartOpen(true)}
    style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
    }}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="24"
        height="24"
        style={{ marginRight: '10px' }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2m4.6 0h9l1 6h-14l1.3-6zm10.9 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-11 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        />
    </svg>
    View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
</button> */}

            {isCartOpen && <CartModal cart={cart} setCart={setCart} onClose={() => setIsCartOpen(false)} />}
        </div>
    );
};

export default RestaurantPage;
