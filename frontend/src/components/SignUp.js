import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import CustomerSignUp from './CustomerSignUp';
import RestaurantSignUp from './RestaurantSignUp';

const SignUp = () => {
    const [selectedForm, setSelectedForm] = useState('customer'); // Default to 'customer' form

    // Handle form type change
    const handleFormChange = (e) => {
        setSelectedForm(e.target.value);
    };

    return (
        <div>
            {/* Navigation Header */}
            <div className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>
            </div>

            {/* Main Signup Container */}
            <div className="signup-container">
                {/* Dropdown for selecting form type */}
                <div className="form-selector">
                    <label htmlFor="form-select">Sign Up as:</label>
                    <select
                        id="form-select"
                        value={selectedForm}
                        onChange={handleFormChange}
                        className="form-select-dropdown"
                    >
                        <option value="customer">Customer</option>
                        <option value="restaurant">Restaurant</option>
                    </select>
                </div>

                {/* Render selected form based on dropdown choice */}
                <div className="form-container">
                    {selectedForm === 'customer' ? (
                        <CustomerSignUp />
                    ) : (
                        <RestaurantSignUp />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
