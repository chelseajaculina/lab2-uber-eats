import React, { useState } from 'react';
import './Login.css';
import CustomerLogin from './CustomerLogin';
import RestaurantLogin from './RestaurantLogin';
import { Link } from 'react-router-dom';

const Login = () => {
    const [selectedForm, setSelectedForm] = useState('customer'); // 'customer' or 'restaurant'

    const handleFormChange = (event) => {
        setSelectedForm(event.target.value);
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/welcome" className="brand-title">Uber <span> Eats</span></Link>
                </div>
                <div className="navbar-right">
                    <Link to="/login">
                        <button className="login-button">Log in</button>
                    </Link>
                    <Link to="/signup">
                        <button className="signup-button">Sign up</button>
                    </Link>
                </div>
            </nav>

            {/* Login Content */}
            <div className="login-container">

                {/* Dropdown to select Customer or Restaurant login */}
                <div className="form-selector">
                    <label htmlFor="form-select">Select Login Type: </label>
                    <select
                        id="form-select"
                        value={selectedForm}
                        onChange={handleFormChange}
                        className="form-select-dropdown"
                    >
                        <option value="customer">Customer Login</option>
                        <option value="restaurant">Restaurant Login</option>
                    </select>
                </div>

                <div className="login-form">
                    {selectedForm === 'customer' ? (
                        <div className="form-container">
                            <CustomerLogin />
                        </div>
                    ) : (
                        <div className="form-container">
                            <RestaurantLogin />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
