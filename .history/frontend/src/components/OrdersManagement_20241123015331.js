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
            customerProfile: null,
            loading: false,
        };
    }
    

    componentDidMount() {
        this.fetchCustomerOrders();
    }

    fetchCustomerOrders = async () => {
        this.setState({ loading: true });

        const customerId = localStorage.getItem('customer_id'); // Assume customer_id is stored in localStorage
        if (!customerId) {
            this.setState({
                error: 'Customer ID is not available. Please log in.',
                loading: false,
            });
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/orders/`); // Fetch orders for the specific customer
            this.setState({
                orders: response.data,
                filteredOrders: response.data,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            this.setState({ error: 'Failed to load orders. Please try again.', loading: false });
        }
    };

    handleStatusFilter = (status) => {
        this.setState({
            selectedStatus: status,
            filteredOrders:
                status === 'All'
                    ? this.state.orders
                    : this.state.orders.filter((order) => order.status === status),
        });
    };

    handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:8000/api/orders/${orderId}/`, {
                delivery_status: newStatus,
            });
            this.fetchCustomerOrders(); // Refresh the list of orders
        } catch (error) {
            console.error('Error updating order status:', error);
            this.setState({ error: `Failed to update status for Order #${orderId}` });
        }
    };

    fetchCustomerProfile = async (customerId) => {
        this.setState({ loading: true });
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/`);
            this.setState({ customerProfile: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching customer profile:', error);
            this.setState({ error: 'Failed to load customer profile. Please try again.', loading: false });
        }
    };

    render() {
        const { filteredOrders, statuses, deliveryStatuses, selectedStatus, customerProfile, error, loading } =
            this.state;

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

                                <div className="status-update">
                                    <label>Update Delivery Status: </label>
                                    <select
                                        value={order.delivery_status}
                                        onChange={(e) =>
                                            this.handleStatusUpdate(order.id, e.target.value)
                                        }
                                    >
                                        {deliveryStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders available</p>
                    )}
                </div>

                {customerProfile && (
                    <div className="customer-profile">
                        <h2>Customer Profile</h2>
                        <p>
                            <strong>Name:</strong> {customerProfile.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {customerProfile.email}
                        </p>
                        <p>
                            <strong>Phone:</strong> {customerProfile.phone}
                        </p>
                        <p>
                            <strong>Address:</strong> {customerProfile.address}
                        </p>
                        <button
                            onClick={() => this.setState({ customerProfile: null })}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default OrdersManagement;
