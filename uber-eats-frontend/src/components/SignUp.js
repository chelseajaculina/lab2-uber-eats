import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/customers/signup/', formData);
            console.log('Response from server:', response.data);
            alert('Registration successful');
            navigate('home/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
              <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>  
            
            </header>
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1>Customer Sign Up</h1>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="text" name="name" onChange={handleChange} placeholder="Full Name" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
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

export default SignUp;
