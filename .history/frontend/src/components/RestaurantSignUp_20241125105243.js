import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiQrCodeLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const RestaurantSignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [restaurantData, setRestaurantData] = useState({
        username: '',
        email: '',
        password: '',
        restaurant_name: '',
        location: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });
    };

    const handleRestaurantSignUpSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8000/api/restaurants/signup/', restaurantData);
            dispatch(login({ access: response.data.access, refresh: response.data.refresh }));
            alert('Sign-up successful');
            navigate('/restaurantdashboard');
        } catch (error) {
            let message = 'Sign-up failed. Please check your details and try again.';
            if (error.response?.data?.username) {
                message = 'Username is already taken. Please try another.';
            } else if (error.response?.data?.email) {
                message = 'Email is already registered. Please use a different email.';
            }
            setErrorMessage(message);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleRestaurantSignUpSubmit}>
                <h3>Restaurant Sign Up</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="text" name="restaurant_name" onChange={handleChange} placeholder="Restaurant Name" required />
                <input type="text" name="location" onChange={handleChange} placeholder="Location" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Sign Up</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default RestaurantSignUp;
