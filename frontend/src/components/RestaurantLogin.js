import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RestaurantLogin.css'
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiQrCodeLine } from 'react-icons/ri';

const RestaurantLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error,setError] = useState('');
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
            const response = await axios.post('http://localhost:8000/api/restaurants/login/', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            alert('Login successful');
            navigate('/restaurantdashboard');  // Redirect to the Restaurant page
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
                <div className="login-buttons">
                    <button className="google-button" type="button">
                        <FcGoogle className="icon" /> Continue with Google
                    </button>
                    <button className="apple-button" type="button">
                        <FaApple className="icon" /> Continue with Apple
                    </button>
                    <button className="qr-code-button" type="button">
                        <RiQrCodeLine className="icon" /> Log in with QR code
                    </button>
                </div>
                <p className="disclaimer">
                    By proceeding, you consent to get calls, WhatsApp, or SMS/RCS messages, including by automated dialer, from Uber and its affiliates to the number provided. Text "STOP" to 89203 to opt out.
                </p>
            </form>
        </div>
    </div>
);
};

export default RestaurantLogin;
