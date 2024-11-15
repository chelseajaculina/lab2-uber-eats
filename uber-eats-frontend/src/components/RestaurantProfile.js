import React, { Component } from 'react';
import axios from 'axios';
import './CustomerProfile.css'; // You can reuse the CustomerProfile CSS for similar styles or create a new CSS file for restaurant-specific styles.
import { Link } from 'react-router-dom';

class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {
                name: '',
                location: '',
                description: '',
                email: '',
                phone: '',
                profilePicture: localStorage.getItem('restaurantProfilePicture') || ''
            },
            authToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
            selectedProfilePicture: null,
            previewProfilePicture: localStorage.getItem('restaurantProfilePicture') || ''
        };

        // Base URL for accessing media files (update this to match your backend configuration)
        this.mediaBaseURL = 'http://localhost:8000/media/';
    }

    // Method to refresh authentication token
    refreshAuthToken = async (callback) => {
        try {
            const response = await axios.post('http://localhost:8000/api/restaurants/token/refresh/', {
                refresh: this.state.refreshToken
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            this.setState({ authToken: newAccessToken }, callback);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    // Fetch restaurant details from the backend
    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/restaurants/me/', {
                headers: { Authorization: `Bearer ${this.state.authToken}` }
            });
            const restaurantData = response.data;
            this.setState({
                restaurant: {
                    ...restaurantData
                },
                previewProfilePicture: restaurantData.profile_picture ? `${this.mediaBaseURL}${restaurantData.profile_picture}` : ''
            });
            if (restaurantData.profile_picture) {
                localStorage.setItem('restaurantProfilePicture', `${this.mediaBaseURL}${restaurantData.profile_picture}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await this.refreshAuthToken(this.fetchRestaurantDetails);
            } else {
                console.error('Error fetching restaurant data:', error);
            }
        }
    };

    componentDidMount() {
        this.fetchRestaurantDetails();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            restaurant: {
                ...prevState.restaurant,
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
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all restaurant fields except profile picture to formData
        Object.keys(this.state.restaurant).forEach(key => {
            if (key !== 'profilePicture' && this.state.restaurant[key]) {
                formData.append(key, this.state.restaurant[key]);
            }
        });

        // Append profile picture only if it has been changed
        if (this.state.selectedProfilePicture instanceof File) {
            formData.append('profile_picture', this.state.selectedProfilePicture);
        }

        try {
            // Send the patch request to update the restaurant profile
            const response = await axios.patch('http://localhost:8000/api/restaurants/update/', formData, {
                headers: {
                    Authorization: `Bearer ${this.state.authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update state if profile picture is changed
            if (response.data.profile_picture) {
                const updatedProfilePicture = `${this.mediaBaseURL}${response.data.profile_picture}?timestamp=${new Date().getTime()}`;
                localStorage.setItem('restaurantProfilePicture', updatedProfilePicture);
                this.setState({
                    restaurant: { ...this.state.restaurant, profilePicture: updatedProfilePicture },
                    previewProfilePicture: updatedProfilePicture
                });
            }

            // Update the rest of the restaurant fields in the state
            this.setState(prevState => ({
                restaurant: {
                    ...prevState.restaurant,
                    name: response.data.name,
                    location: response.data.location,
                    description: response.data.description,
                    email: response.data.email,
                    phone: response.data.phone
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
                    <Link to="/home"><h2>Uber Restaurant Account</h2></Link>
                    <ul>
                        <li className="active">Account Info</li>
                        <li>Menu Management</li>
                        <li>Orders Management</li>
                        <li>Analytics</li>
                    </ul>
                </aside>
    
                <main className="content">
                    <h1>{this.state.restaurant.name ? `${this.state.restaurant.name} Account Info` : "Restaurant Account Info"}</h1>
    
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
                            <label>Restaurant Name:</label>
                            <input type="text" name="name" value={this.state.restaurant.name || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input type="text" name="location" value={this.state.restaurant.location || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="description" value={this.state.restaurant.description || ''} onChange={this.handleInputChange}></textarea>
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={this.state.restaurant.email || ''} onChange={this.handleInputChange} />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="tel" name="phone" value={this.state.restaurant.phone || ''} onChange={this.handleInputChange} />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </main>
            </div>
        );
    }
}

export default RestaurantProfile;
