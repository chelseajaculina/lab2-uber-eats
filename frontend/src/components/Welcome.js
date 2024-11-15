import './Welcome.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Welcome = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in by looking for an auth token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    // Function to toggle side menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="landing-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                <button className="menu-button" onClick={toggleMenu} style={{ color: 'black' }}>☰</button>
<h3><Link to="/home" className="brand-title" style={{ color: 'black' }}>Uber Eats</Link></h3>

                </div>
                {!isLoggedIn && (
                    <div className="navbar-right">
                        <button className="login-button" onClick={handleLoginClick}>Log in</button>
                        <button className="signup-button" onClick={() => navigate('/signup')}>Sign up</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <h1>Order delivery near you</h1>

                {/* Address Input Section */}
                <div className="address-input-section">
                    <div className="input-box">
                        <FaMapMarkerAlt className="icon" />
                        <input type="text" placeholder="Enter delivery address" />
                    </div>
                    <div className="delivery-time-dropdown">
                        <AiOutlineClockCircle className="icon" />
                        <select>
                            <option>Deliver now</option>
                            <option>Schedule for later</option>
                        </select>
                    </div>
                    <button className="search-button">Search here</button>
                </div>

                {/* Sign In Link */}
                {!isLoggedIn && (
                    <p className="signin-link">
                        Or <button className="link-button" onClick={() => navigate('/login')}>Sign in</button>
                    </p>
                )}
            </header>

            {/* Side Menu for Hamburger */}
            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>
                    {!isLoggedIn ? (
                        <>
                            <button className="signup-side-button" onClick={() => navigate('/signup')}>Sign up</button>
                            <button className="login-side-button" onClick={() => navigate('/login')}>Log in</button>
                            <div className="side-links">
                                <Link to="/business-account">Create a business account</Link>
                                <Link to="/add-restaurant">Add your restaurant</Link>
                                <Link to="/signup-to-deliver">Sign up to deliver</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Welcome back!</h3>
                            <div className="side-links">
                                <Link to="/orders">Your Orders</Link>
                                <Link to="/account">Account Settings</Link>
                                <Link to="/help">Help</Link>
                            </div>
                            <button className="logout-button" onClick={() => {
                                localStorage.removeItem('authToken');
                                setIsLoggedIn(false);
                                toggleMenu(); // Close the side menu after logging out
                            }}>Log out</button>
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
        </div>
    );
};

export default Welcome;
