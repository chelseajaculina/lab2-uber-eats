import React, { Component } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

class OrdersManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerId: null,
            orders: [],
            filteredOrders: [],
            statuses: ['New', 'Delivered', 'Cancelled'],
            deliveryStatuses: ['Order Received', 'Preparing', 'On the Way', 'Pick up Ready', 'Delivered', 'Picked Up'],
            selectedStatus: 'All',
            error: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.fetchCustomerId();
    }

    fetchCustomerId = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn('Access token not found.');
            this.setState({ error: 'Access token is missing. Please log in.' });
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/customers/user-profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const customerId = response.data.id; // Assuming the response has an `id` field for customer ID
            console.log('Customer ID retrieved from backend:', customerId);
            this.setState({ customerId }, this.fetchCustomerOrders); // Fetch orders after setting the customerId
        } catch (error) {
            console.error('Error fetching customer ID:', error.response?.data || error.message);
            this.setState({ error: 'Failed to fetch customer ID. Please try again later.' });
        }
    };

    fetchCustomerOrders = async () => {
        const { customerId } = this.state;

        if (!customerId) {
            console.warn('Customer ID is not set. Cannot fetch orders.');
            this.setState({ error: 'Customer ID is missing. Please log in.' });
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/orders/`);
            this.setState({
                orders: response.data,
                filteredOrders: response.data,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            this.setState({ error: 'Failed to load orders. Please try again later.', loading: false });
        }
    };

    handleStatusFilter = (status) => {
        this.setState((prevState) => ({
            selectedStatus: status,
            filteredOrders:
                status === 'All'
                    ? prevState.orders
                    : prevState.orders.filter((order) => order.status === status),
        }));
    };

    render() {
        const { filteredOrders, statuses, deliveryStatuses, selectedStatus, error, loading } = this.state;

        return (
            <div className="orders-management">
                <h1>Your Orders</h1>
                {error && <p className="error">{error}</p>}
                {loading && <div className="spinner">Loading...</div>}

                <div className="status-filter">
                    <label>Filter by Status: </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => this.handleStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="orders-list">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="order-card">
                                <h2>Order #{order.id}</h2>
                                <p>
                                    <strong>Status:</strong> {order.status}
                                </p>
                                <p>
                                    <strong>Delivery Status:</strong> {order.delivery_status}
                                </p>
                                <p>
                                    <strong>Total:</strong> ${order.total}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No orders available</p>
                    )}
                </div>
            </div>
        );
    }
}

export default OrdersManagement;
