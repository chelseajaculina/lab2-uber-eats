import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';  // Assuming you have a CSS file for styling

const RestaurantSignUp = () => {
    const [restaurantData, setRestaurantData] = useState({
        username: '',
        email: '',
        password: '',
        restaurant_name: '',
        location: ''
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });
    };

    const handleRestaurantSignUpSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await axios.post('http://localhost:8000/api/restaurants/signup/', restaurantData);
            alert('Sign-up successful');
            navigate('/login');  // Redirect to the login page after successful sign-up
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Sign-up failed:', error.response.data);  // Log detailed error from backend
                alert('Sign-up failed: ' + JSON.stringify(error.response.data));  // Display detailed error message
            } else {
                console.error('Sign-up failed:', error);
                alert('Sign-up failed. Please check your details and try again.');
            }
        }
    };
    

    return (
        <div className="signup-container">
            <div className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>  
            </div>
            <form onSubmit={handleRestaurantSignUpSubmit} className="signup-form">
                <h3>Restaurant Sign Up</h3>
                <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="restaurant_name"
                    onChange={handleChange}
                    placeholder="Restaurant Name"
                    required
                />
                <input
                    type="text"
                    name="location"
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />
                <button type="submit" className="continue-button">Sign Up</button>

                <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>
                <button className="google-button" type="button">
                    <img src="/images/google-icon.png" alt="Google Icon" /> Continue with Google
                </button>
                <button className="apple-button" type="button">
                    <img src="/images/apple-icon.png" alt="Apple Icon" /> Continue with Apple
                </button>
                <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>
                <button className="qr-code-button" type="button">
                    <img src="/images/qr-icon.png" alt="QR Icon" /> Log in with QR code
                </button>
                <p className="disclaimer">
                    By proceeding, you consent to get calls, WhatsApp, or SMS/RCS messages, including by automated dialer, from Uber and its affiliates to the number provided. Text "STOP" to 89203 to opt out.
                </p>
            </form>
        </div>
    );
};

export default RestaurantSignUp;
