import React, { Component } from 'react';
import axios from 'axios';
import './RestaurantProfile.css';
import { Link } from 'react-router-dom';

class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {
                restaurant_name: '',
                location: '',
                description: '',
                contact_info: '',
                email: '',
                timings: '',
                profilePicture: localStorage.getItem('restaurantProfilePicture') || ''
            },
            authToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
            selectedProfilePicture: null,
            previewProfilePicture: localStorage.getItem('restaurantProfilePicture') || ''
        };

        this.mediaBaseURL = 'http://localhost:8000/media/';
    }

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

    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/restaurants/me/', {
                headers: { Authorization: `Bearer ${this.state.authToken}` }
            });
            const restaurantData = response.data;

            this.setState({
                restaurant: {
                    restaurant_name: restaurantData.restaurant_name || '',
                    location: restaurantData.location || '',
                    description: restaurantData.description || '',
                    contact_info: restaurantData.contact_info || '',
                    email: restaurantData.email || '',
                    timings: restaurantData.timings || '',
                    profilePicture: restaurantData.profile_picture ? `${this.mediaBaseURL}${restaurantData.profile_picture}` : ''
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

    handleProfilePictureUpload = async () => {
        const formData = new FormData();
        if (this.state.selectedProfilePicture instanceof File) {
            formData.append('profile_picture', this.state.selectedProfilePicture);
        } else {
            console.error("No valid file selected for profile picture.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/restaurants/upload-profile-picture/', formData, {
                headers: {
                    Authorization: `Bearer ${this.state.authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data.profile_picture) {
                const updatedProfilePicture = `${this.mediaBaseURL}${response.data.profile_picture}`;
                localStorage.setItem('restaurantProfilePicture', updatedProfilePicture);
                this.setState({
                    restaurant: { ...this.state.restaurant, profilePicture: updatedProfilePicture },
                    previewProfilePicture: updatedProfilePicture
                });
                alert('Profile picture updated successfully');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert(`Error: ${error.message}`);
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Append all restaurant fields (text data) to formData
        Object.keys(this.state.restaurant).forEach(key => {
            if (key !== 'profilePicture' && this.state.restaurant[key]) {
                formData.append(key, this.state.restaurant[key]);
            }
        });
    
        try {
            const response = await axios.patch('http://localhost:8000/api/restaurants/update/', formData, {
                headers: {
                    Authorization: `Bearer ${this.state.authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Update the restaurant fields in the state with the response data
            this.setState(prevState => ({
                restaurant: {
                    ...prevState.restaurant,
                    restaurant_name: response.data.restaurant_name,
                    location: response.data.location,
                    description: response.data.description,
                    contact_info: response.data.contact_info,
                    email: response.data.email,
                    timings: response.data.timings
                }
            }));
    
            // Update local storage with the new profile picture URL if it was changed
            if (response.data.profile_picture) {
                const updatedProfilePictureUrl = `${this.mediaBaseURL}${response.data.profile_picture}`;
                localStorage.setItem('restaurantProfilePicture', updatedProfilePictureUrl);
                this.setState({ previewProfilePicture: updatedProfilePictureUrl });
            }
    
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
                    <Link to="/restaurantdashboard"><h2>Uber Restaurant Account</h2></Link>
                    <div>
                        <img src={this.state.previewProfilePicture} alt="Current Profile" className="profile-picture" />
                    </div>
                    <ul>
                        <li className="active">Account Info</li>
                        <li>Menu Management</li>
                        <li>Orders Management</li>
                        <li>Analytics</li>
                    </ul>
                </aside>

                <main className="content">
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
                        <button onClick={this.handleProfilePictureUpload} className="profile-picture-btn">
                            Update Profile Picture
                        </button>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label>Restaurant Name:</label>
                            <input type="text" name="restaurant_name" value={this.state.restaurant.restaurant_name} onChange={this.handleInputChange} placeholder="Enter Restaurant Name" />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input type="text" name="location" value={this.state.restaurant.location} onChange={this.handleInputChange} placeholder="Enter Location" />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="description" value={this.state.restaurant.description} onChange={this.handleInputChange} placeholder="Enter Description"></textarea>
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={this.state.restaurant.email} onChange={this.handleInputChange} placeholder="Enter Email" />
                        </div>
                        <div>
                            <label>Contact Info:</label>
                            <input type="text" name="contact_info" value={this.state.restaurant.contact_info} onChange={this.handleInputChange} placeholder="Enter Contact Info" />
                        </div>
                        <div>
                            <label>Timings:</label>
                            <input type="text" name="timings" value={this.state.restaurant.timings || ''} onChange={this.handleInputChange} placeholder="Enter Restaurant Timings" />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </main>
            </div>
        );
    }
}

export default RestaurantProfile;