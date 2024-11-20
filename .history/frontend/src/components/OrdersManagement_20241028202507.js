import React, { Component } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

class OrdersManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            filteredOrders: [],
            statuses: ['New', 'Delivered', 'Cancelled'],
            deliveryStatuses: ['Order Received', 'Preparing', 'On the Way', 'Pick up Ready', 'Delivered', 'Picked Up'],
            selectedStatus: 'All',
            error: null,
            customerProfile: null
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    // Fetch orders from the API
    fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/orders/'); // Replace with your API endpoint
            this.setState({ orders: response.data, filteredOrders: response.data });
        } catch (error) {
            console.error('Error fetching orders:', error);
            this.setState({ error: 'Failed to load orders' });
        }
    };

    // Handle filtering by order status
    handleStatusFilter = (status) => {
        this.setState({
            selectedStatus: status,
            filteredOrders: status === 'All'
                ? this.state.orders
                : this.state.orders.filter(order => order.status === status)
        });
    };

    // Handle updating the delivery status of an order
    handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:8000/api/orders/${orderId}/`, { delivery_status: newStatus });
            this.fetchOrders(); // Refresh orders after update
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Fetch customer profile by order ID
    fetchCustomerProfile = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/`); // Replace with your API endpoint
            this.setState({ customerProfile: response.data });
        } catch (error) {
            console.error('Error fetching customer profile:', error);
        }
    };

    render() {
        const { filteredOrders, statuses, deliveryStatuses, selectedStatus, customerProfile, error } = this.state;

        return (
            <div className="orders-management">
                <h1>Orders Management</h1>
                {error && <p className="error">{error}</p>}

                {/* Filter by order status */}
                <div className="status-filter">
                    <label>Filter by Status: </label>
                    <select value={selectedStatus} onChange={(e) => this.handleStatusFilter(e.target.value)}>
                        <option value="All">All</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* List of filtered orders */}
                <div className="orders-list">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <h2>Order #{order.id}</h2>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Delivery Status:</strong> {order.delivery_status}</p>
                                <p><strong>Customer:</strong> {order.customer_name}</p>

                                {/* Update delivery status */}
                                <div className="status-update">
                                    <label>Update Delivery Status: </label>
                                    <select
                                        value={order.delivery_status}
                                        onChange={(e) => this.handleStatusUpdate(order.id, e.target.value)}
                                    >
                                        {deliveryStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* View customer profile */}
                                <button onClick={() => this.fetchCustomerProfile(order.customer_id)}>
                                    View Customer Profile
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No orders available</p>
                    )}
                </div>

                {/* Display customer profile */}
                {customerProfile && (
                    <div className="customer-profile">
                        <h2>Customer Profile</h2>
                        <p><strong>Name:</strong> {customerProfile.name}</p>
                        <p><strong>Email:</strong> {customerProfile.email}</p>
                        <p><strong>Phone:</strong> {customerProfile.phone}</p>
                        <p><strong>Address:</strong> {customerProfile.address}</p>
                    </div>
                )}
            </div>
        );
    }
}

export default OrdersManagement;
