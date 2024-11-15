import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RestaurantLogin.css';
import { apiMethods } from '../api/api';

const RestaurantLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiMethods.loginRestaurant(credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            alert('Login successful');
            navigate('/restaurantdashboard');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error);
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);  // Display the error message from the backend
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div>   
            <div className="login-container">
            <div className="login-header">
            <Link to="/home" className="brand-title">Uber <span>Business</span></Link>  
        </div>
    
            <form onSubmit={handleSubmit} className="login-form">

                <h3>Restaurant Login</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Restaurant Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Login</button>
                {error && <p className="error-message">{error}</p>}

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
    </div>
);
};

export default RestaurantLogin;
