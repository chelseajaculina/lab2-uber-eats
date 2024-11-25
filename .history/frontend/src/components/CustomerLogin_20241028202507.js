import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiQrCodeLine } from 'react-icons/ri';

const CustomerLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (localStorage.getItem('access_token')) {
            alert('You are already logged in!');
            navigate('/home');  // Redirect to the Home page
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/customers/login/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            alert('Login successful');
            navigate('/home');  // Redirect to the Home page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
    
        
        <div className="login-container">
             <div className="login-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>  
            </div>
        
            <form onSubmit={handleSubmit} className="login-form">

                <h3>Customer Login</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Customer Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Login</button>
            
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

export default CustomerLogin;
