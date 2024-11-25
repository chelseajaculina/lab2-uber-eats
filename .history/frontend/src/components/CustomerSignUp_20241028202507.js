import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiQrCodeLine } from 'react-icons/ri';

const CustomerSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error message
        try {
            await axios.post('http://localhost:8000/api/customers/signup/', formData);
            alert('Registration successful');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            let message = 'An unexpected error occurred. Please try again later.';
            
            // Handle specific error messages for form fields
            if (error.response && error.response.status === 400) {
                if (error.response.data.username) {
                    message = 'Username is already taken. Please try another.';
                } else if (error.response.data.email) {
                    message = 'Email is already registered. Please try another or log in.';
                } else {
                    message = 'Registration failed. Please check your details and try again.';
                }
            }
            
            setErrorMessage(message);  // Update the error message state to display on the page
            alert(message);  // Display alert to the user
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>
            </header>
            <form className="signup-form" onSubmit={handleSubmit}>
                <h3>Customer Sign Up</h3>
                <input 
                    type="text" 
                    name="username" 
                    onChange={handleChange} 
                    placeholder="Username" 
                    required 
                />
                {errorMessage.includes('Username is already taken') && (
                    <p className="field-error-message">Username is already taken. Please try another.</p>
                )}
                <input 
                    type="text" 
                    name="name" 
                    onChange={handleChange} 
                    placeholder="Full Name" 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                />
                {errorMessage.includes('Email is already registered') && (
                    <p className="field-error-message">Email is already registered. Please try another or log in.</p>
                )}
                <input 
                    type="password" 
                    name="password" 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit" className="continue-button">Sign Up</button>

                {/* General error message below the form */}
                {errorMessage && !errorMessage.includes('Username is already taken') && !errorMessage.includes('Email is already registered') && (
                    <p className="error-message">{errorMessage}</p>
                )}

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

export default CustomerSignUp;
