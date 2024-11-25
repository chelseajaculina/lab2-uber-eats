import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RestaurantLogin.css';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiQrCodeLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const RestaurantLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/restaurants/login/', credentials, {
                headers: { 'Content-Type': 'application/json' }
            });
            dispatch(login({ access: response.data.access, refresh: response.data.refresh }));
            alert('Login successful');
            navigate('/restaurantdashboard');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error);
            setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h3>Restaurant Login</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Restaurant Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default RestaurantLogin;
