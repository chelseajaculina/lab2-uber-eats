import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiQrCodeLine } from 'react-icons/ri';

const RestaurantSignUp = () => {
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState({
        username: '',
        email: '',
        password: '',
        restaurant_name: '',
        location: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submit
    const handleRestaurantSignUpSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error message

        try {
            await axios.post('http://localhost:8000/api/restaurants/signup/', restaurantData);
            alert('Sign-up successful');
            navigate('/login'); // Redirect to the login page after successful sign-up
        } catch (error) {
            if (error.response && error.response.data) {
                let message = 'Sign-up failed. Please check your details and try again.';

                if (error.response.data.username) {
                    message = 'Username is already taken. Please try another.';
                } else if (error.response.data.email) {
                    message = 'Email is already registered. Please use a different email.';
                }

                setErrorMessage(message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Business</span></Link>
            </header>
            <form className="signup-form" onSubmit={handleRestaurantSignUpSubmit}>
                <h3>Restaurant Sign Up</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="text" name="restaurant_name" onChange={handleChange} placeholder="Restaurant Name" required />
                <input type="text" name="location" onChange={handleChange} placeholder="Location" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />

                <button type="submit" className="continue-button">Sign Up</button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>

                <div className="login-buttons">
                    <button className="google-button" type="button">
                        <FcGoogle className="icon" /> Continue with Google
                    </button>
                    <button className="apple-button" type="button">
                        <FaApple className="icon" /> Continue with Apple
                    </button>

                    <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>
                    <button className="qr-code-button" type="button">
                        <RiQrCodeLine className="icon" /> Log in with QR code
                    </button>
                </div>

                <p className="disclaimer">
                    By proceeding, you consent to get calls, WhatsApp, or SMS/RCS messages, including by automated dialer, from Uber and its affiliates to the number provided. Text "STOP" to 89203 to opt out.
                </p>
            </form>
        </div>
    );
};

export default RestaurantSignUp;
