import React, { useState } from 'react';
import './NavBar.css';
import { FaBars, FaSearch, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        // Add your login logic here
        navigate('/login');
    };

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        <FaBars />
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
                            onChange={handleLocationChange}
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
                        <FaSearch />
                        <input type="text" placeholder="Search Uber Eats" />
                    </div>
                    <button className="login-button" onClick={handleLoginClick}>Log in</button>
                    <button className="signup-button">Sign up</button>
                    <FaShoppingCart className="shopping-cart-icon" />
                </div>
            </nav>

            {/* Side Menu for Hamburger */}
            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>
                    <button className="signup-side-button">Sign up</button>
                    <button className="login-side-button">Log in</button>
                    <div className="side-links">
                        <Link to="/business-account">Create a business account</Link>
                        <Link to="/add-restaurant">Add your restaurant</Link>
                        <Link to="/signup-to-deliver">Sign up to deliver</Link>
                    </div>
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

export default NavBar;
