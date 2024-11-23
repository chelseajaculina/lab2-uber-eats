import React, { useState } from 'react';
import { createOrder } from './api';

const OrderPage = () => {
    const [formData, setFormData] = useState({
        restaurant: '',
        customer: '',
        dish: '',
        status: 'New',
        delivery_status: 'Order Received',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createOrder(formData);
            alert('Order created successfully!');
            console.log(response);
        } catch (error) {
            alert('Error creating order: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Restaurant ID:</label>
                <input
                    type="text"
                    name="restaurant"
                    value={formData.restaurant}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Customer Name:</label>
                <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Dish ID:</label>
                <input
                    type="text"
                    name="dish"
                    value={formData.dish}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Status:</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="New">New</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div>
                <label>Delivery Status:</label>
                <select
                    name="delivery_status"
                    value={formData.delivery_status}
                    onChange={handleChange}
                >
                    <option value="Order Received">Order Received</option>
                    <option value="Preparing">Preparing</option>
                    <option value="On the Way">On the Way</option>
                    <option value="Pick up Ready">Pick up Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Picked Up">Picked Up</option>
                </select>
            </div>
            <button type="submit">Create Order</button>
        </form>
    );
};

export default OrderPage;
