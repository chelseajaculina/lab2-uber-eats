import React, { Component } from 'react';
import axios from 'axios';
import './CustomerProfile.css';
import { Link } from 'react-router-dom';

class CustomerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                date_of_birth: '',
                city: '',
                state: '',
                country: '',
                nickname: '',
                email: '',
                phone: '',
                profilePicture: localStorage.getItem('profilePicture') || '',
                favorites: [] // Set favorites as an empty array by default
            },
            countries: [],
            authToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
            selectedProfilePicture: null,
            previewProfilePicture: localStorage.getItem('profilePicture') || ''
        };

        // Base URL for accessing media files (update this to match your backend configuration)
        this.mediaBaseURL = 'http://localhost:8000/media/';
    }

    // Method to refresh authentication token
    refreshAuthToken = async (callback) => {
        try {
            const response = await axios.post('http://localhost:8000/api/customers/token/refresh/', {
                refresh: this.state.refreshToken
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            this.setState({ authToken: newAccessToken }, callback);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    // Fetch user details from the backend
    fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/customers/me/', {
                headers: { Authorization: `Bearer ${this.state.authToken}` }
            });
            const userData = response.data;
            this.setState({
                user: {
                    ...userData,
                    favorites: userData.favorites || [] // Default to an empty array if undefined
                },
                previewProfilePicture: userData.profile_picture ? `${this.mediaBaseURL}${userData.profile_picture}` : ''
            });
            if (userData.profile_picture) {
                localStorage.setItem('profilePicture', `${this.mediaBaseURL}${userData.profile_picture}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await this.refreshAuthToken(this.fetchUserDetails);
            } else {
                console.error('Error fetching user data:', error);
            }
        }
    };

    // Fetch list of countries
    fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const sortedCountries = response.data.map(country => country.name.common).sort();
            this.setState({ countries: sortedCountries });
        } catch (error) {
            console.error('Error fetching countries data:', error);
            this.setState({ countries: [] });
        }
    };

    componentDidMount() {
        this.fetchUserDetails();
        this.fetchCountries();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [name]: value
            }
        }));
    };

    handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ selectedProfilePicture: file });
            const previewUrl = URL.createObjectURL(file);
            this.setState({ previewProfilePicture: previewUrl });
        } else {
            console.error("No file selected");
        }
    
        
        const { name, value } = e.target;

        if (name === "dateOfBirth") {
            // Regular expression to validate the format YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (value === '' || dateRegex.test(value)) {
                // Update state only if value is empty or matches the YYYY-MM-DD format
                this.setState(prevState => ({
                    user: {
                        ...prevState.user,
                        [name]: value
                    }
                }));
            } else {
                console.warn("Please enter the date in the format YYYY-MM-DD.");
            }
        } else {
            this.setState(prevState => ({
                user: {
                    ...prevState.user,
                    [name]: value
                }
            }));
        }

    };
    handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Append all user fields except profile picture to formData
        Object.keys(this.state.user).forEach(key => {
            if (key !== 'profilePicture' && this.state.user[key]) {
                formData.append(key, this.state.user[key]);
            }
        });
    
        // Append profile picture only if it has been changed
        if (this.state.selectedProfilePicture instanceof File) {
            formData.append('profile_picture', this.state.selectedProfilePicture);
        }
    
        try {
            // Send the patch request to update the user profile
            const response = await axios.patch('http://localhost:8000/api/customers/update/', formData, {
                headers: {
                    Authorization: `Bearer ${this.state.authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Update state if profile picture is changed
            if (response.data.profile_picture) {
                const updatedProfilePicture = `${this.mediaBaseURL}${response.data.profile_picture}?timestamp=${new Date().getTime()}`;
                localStorage.setItem('profilePicture', updatedProfilePicture);
                this.setState({
                    user: { ...this.state.user, profilePicture: updatedProfilePicture },
                    previewProfilePicture: updatedProfilePicture
                });
            }
    
            // Update the rest of the user fields in the state
            this.setState(prevState => ({
                user: {
                    ...prevState.user,
                    name: response.data.name,
                    date_of_birth: response.data.date_of_birth,
                    city: response.data.city,
                    state: response.data.state,
                    country: response.data.country,
                    nickname: response.data.nickname,
                    email: response.data.email,
                    phone: response.data.phone,
                    favorites: response.data.favorites || [],
                }
            }));
    
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        }
    };
    

    render() {
        return (
            <div className="dashboard-container">
                <aside className="sidebar">
                   <Link to="/home"><h2>Uber Account</h2></Link>
                    <ul>
                        <li className="active">Account Info</li>
                        <li>Security</li>
                        <li>Privacy & Data</li>
                    </ul>
                </aside>

                <main className="content">
                    <h1>Account Info</h1>

                    <div className="profile-section">
                        <label>Profile Picture:</label><br />
                        {this.state.previewProfilePicture ? (
                            <div>
                            
                                <img src={this.state.previewProfilePicture} alt="Current Profile" className="profile-picture" />
                            </div>
                        ) : (
                            <p>No profile picture available.</p>
                        )}
                        
                        <label>Change:</label><br />
                        <input
                            type="file"
                            className="profile-picture-input"
                            onChange={this.handleProfilePictureChange}
                            accept=".png,.jpg,.jpeg,.gif"
                        />
                        <button onClick={this.handleSubmit} className="profile-picture-btn">
                            Update Profile Picture
                        </button>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        {/* Rest of the form fields */}
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={this.state.user.name || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Date of Birth:</label>
                            <input type="text" name="date_of_birth" value={this.state.user.date_of_birth || ''} onChange={this.handleInputChange} placeholder="YYYY-MM-DD"/>
                        </div>
                        <div>
                            <label>City:</label>
                            <input type="text" name="city" value={this.state.user.city || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>State:</label>
                            <input type="text" name="state" value={this.state.user.state || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Country:</label>
                            <select name="country" value={this.state.user.country || ''} onChange={this.handleInputChange}>
                                <option value="" disabled>Select a country</option>
                                {this.state.countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Nickname:</label>
                            <input type="text" name="nickname" value={this.state.user.nickname || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={this.state.user.email || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="tel" name="phone" value={this.state.user.phone || ''} onChange={this.handleInputChange} />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>

                    <div className="favorites-section">
                        <h2>Favorites</h2>
                        <ul>
                            {Array.isArray(this.state.user.favorites) ? (
                                this.state.user.favorites.map((favorite, index) => (
                                    <li key={index}>{favorite}</li>
                                ))
                            ) : (
                                <li>No favorites available.</li>
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        );
    }
}

export default CustomerProfile;
