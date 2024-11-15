import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantTab.css';

const RestaurantTab = () => {
    const [restaurant, setRestaurant] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);

    // Fetch restaurant details and menu items on mount
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                // Fetch restaurant details (replace with actual restaurant ID and API endpoint)
                const restaurantResponse = await axios.get('http://localhost:8000/api/restaurants/1/');
                setRestaurant(restaurantResponse.data);

                // Fetch restaurant menu items
                const menuResponse = await axios.get('http://localhost:8000/api/restaurants/');
                setMenuItems(menuResponse.data);
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, []);

    // Add dish to cart
    const addToCart = (menuItem) => {
        setCart(prevCart => [...prevCart, menuItem]);
    };

    // Remove dish from cart
    const removeFromCart = (index) => {
        setCart(prevCart => prevCart.filter((_, i) => i !== index));
    };

    // Handle order finalization
    const finalizeOrder = () => {
        alert('Order has been finalized! Thank you.');
        setCart([]);
        setIsCartVisible(false);
    };

    return (
        <div className="restaurant-tab">
            {/* Restaurant Details Section */}
            <div className="restaurant-details">
                <h1>{restaurant.name}</h1>
                <p>{restaurant.description}</p>
                <p><strong>Location:</strong> {restaurant.location}</p>
            </div>

            {/* Menu Section */}
            <div className="menu-section">
                <h2>Menu</h2>
                <div className="menu-items">
                    {menuItems.map((item, index) => (
                        <div key={index} className="menu-item">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                            <button onClick={() => addToCart(item)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Cart Section */}
            <div className="view-cart-section">
                <button onClick={() => setIsCartVisible(!isCartVisible)} className="view-cart-button">
                    {isCartVisible ? "Hide Cart" : `View Cart (${cart.length})`}
                </button>

                {isCartVisible && (
                    <div className="cart-details">
                        <h2>Your Cart</h2>
                        {cart.length === 0 ? (
                            <p>No items in cart.</p>
                        ) : (
                            <div>
                                {cart.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <h3>{item.name}</h3>
                                        <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(index)}>Remove</button>
                                    </div>
                                ))}
                                <button onClick={finalizeOrder} className="finalize-order-button">Finalize Order</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantTab;
