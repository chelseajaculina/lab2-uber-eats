import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { RiQrCodeLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const CustomerSignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8000/api/customers/signup/', formData);
            dispatch(login({ access: response.data.access, refresh: response.data.refresh }));
            alert('Registration successful');
            navigate('/home');
        } catch (error) {
            console.error('Registration failed:', error);
            let message = 'An unexpected error occurred. Please try again later.';
            if (error.response && error.response.status === 400) {
                if (error.response.data.username) {
                    message = 'Username is already taken. Please try another.';
                } else if (error.response.data.email) {
                    message = 'Email is already registered. Please try another or log in.';
                }
            }
            setErrorMessage(message);
            alert(message);
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>
            </header>
            <form className="signup-form" onSubmit={handleSubmit}>
                <h3>Customer Sign Up</h3>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="text" name="name" onChange={handleChange} placeholder="Full Name" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Sign Up</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default CustomerSignUp;
