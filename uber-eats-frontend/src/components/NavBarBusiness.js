import React, { useState, useEffect } from 'react';
import './NavBar.css';
import axios from 'axios';
import {
    FaBars, FaMapMarkerAlt, FaShoppingCart,
    FaRegBookmark, FaUtensils, FaClipboardList, FaLifeRing, FaChartLine, FaConciergeBell, FaGift, FaUsers
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout'; // Import the Logout component

const NavBarBusiness = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');
    const [username, setName] = useState('');
    const [profilePicture, setProfilePic] = useState(localStorage.getItem('profilePicture') || '');
    const [restaurantName, setRestaurantName] = useState(''); // New state for restaurant name
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(''); // New state to track user type (e.g., 'customer' or 'restaurant')
    const [searchQuery, setSearchQuery] = useState('');

    // Toggle the side menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Check if the user is logged in and fetch user data if so
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/users/me/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('Fetched data:', response.data);
                    setName(response.data.name);
                    setUserType(response.data.user_type); // Get user type from response

                    if (response.data.restaurant_name) {
                        setRestaurantName(response.data.restaurant_name); // Set restaurant name from response
                    }

                    if (response.data.profile_picture) {
                        const profilePictureUrl = response.data.profile_picture;
                        setProfilePic(profilePictureUrl);
                        localStorage.setItem('profilePicture', profilePictureUrl); // Persist in localStorage
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                }
            };
            fetchUserData();
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        <FaBars color="black" />
                    </button>
                    <h2 className="brand-title">
                        <Link to="/" className="brand-link">Uber Eats</Link>
                    </h2>
                    <div className="delivery-pickup-buttons">
                        <button className="delivery-btn active">Delivery</button>
                        <button className="pickup-btn">Pickup</button>
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="location">
                        <FaMapMarkerAlt />
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="location-dropdown"
                        >
                            <option value="San Jose State University">San Jose State University</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="New York">New York</option>
                            <option value="Chicago">Chicago</option>
                        </select>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Uber Eats"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isLoggedIn ? (
                        <FaShoppingCart className="shopping-cart-icon" />
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-button" onClick={() => navigate('/login')}>Log in</button>
                            <button className="signup-button" onClick={() => navigate('/signup')}>Sign up</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Side Menu for Hamburger */}
            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>

                    {isLoggedIn ? (
                        userType === 'customer' ? (
                            // Customer Side Menu
                            <div className="user-info">
                                <img src={profilePicture} alt="User Profile" className="user-profile-pic" />
                                <h3>Welcome, {username || "Guest"}</h3>
                                <Link to="/customerprofile" className="manage-account-link">Manage account</Link>
                                <div className="side-links">
                                    <Link to="/orders" onClick={toggleMenu}><FaRegBookmark /> Orders</Link>
                                    <Link to="/favorites" onClick={toggleMenu}><FaClipboardList /> Favorites</Link>
                                    <Link to="/wallet" onClick={toggleMenu}><FaUtensils /> Wallet</Link>
                                    <Link to="/help" onClick={toggleMenu}><FaLifeRing /> Help</Link>
                                </div>
                                <Logout />
                            </div>
                        ) : (
                            // Restaurant Side Menu
                            <div className="user-info">
                                <img src={profilePicture} alt="User Profile" className="user-profile-pic" />
                                <h3>Welcome, {restaurantName || "Restaurant Owner"}</h3> {/* Display restaurant name */}
                                <Link to="/restaurantprofile" className="manage-account-link">Manage account</Link>
                                <div className="side-links">
                                    <Link to="/manage-orders" onClick={toggleMenu}><FaClipboardList /> Manage Orders</Link>
                                    <Link to="/manage-dishes" onClick={toggleMenu}><FaConciergeBell /> Manage Dishes</Link>
                                    <Link to="/restaurant-analytics" onClick={toggleMenu}><FaChartLine /> Analytics</Link>
                                    <Link to="/promotions" onClick={toggleMenu}><FaGift /> Promotions</Link>
                                    <Link to="/help" onClick={toggleMenu}><FaLifeRing /> Help</Link>
                                    <Link to="/staff" onClick={toggleMenu}><FaUsers /> Manage Staff</Link>
                                </div>
                                <Logout />
                            </div>
                        )
                    ) : (
                        // Menu for Guests (Not Logged In)
                        <>
                            <button className="signup-side-button" onClick={() => navigate('/signup')}>Sign up</button>
                            <button className="login-side-button" onClick={() => navigate('/login')}>Log in</button>
                            <div className="side-links">
                                <Link to="/business-account" onClick={toggleMenu}>Create a business account</Link>
                                <Link to="/add-restaurant" onClick={toggleMenu}>Add your restaurant</Link>
                                <Link to="/signup-to-deliver" onClick={toggleMenu}>Sign up to deliver</Link>
                            </div>
                        </>
                    )}

                    <div className="download-app">
                        <img src="/images/uber-eats-logo.png" alt="Uber Eats" />
                        <p>There's more to love in the app.</p>
                        <div className="app-links">
                            <button>iPhone</button>
                            <button>Android</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBarBusiness;
