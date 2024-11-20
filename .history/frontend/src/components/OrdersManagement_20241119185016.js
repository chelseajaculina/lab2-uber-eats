import React, { Component } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

class OrdersManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAddress: '',
            newAddress: {
                street: '',
                apartment: '',
                city: '',
                state: '',
                zipcode: '',
            },
            orderSummary: [
                { item: '10 Wings', quantity: 2, price: 20 },
                { item: '10 pc Wing Combo', quantity: 1, price: 14.79 },
                { item: 'Seasoned Fries', quantity: 1, price: 10 },
            ],
            totalAmount: 44.79,
        };
    }

    handlePlaceOrder = async () => {
        const orderData = {
            customer: this.props.customerId, // Pass logged-in customer's ID
            address: this.state.selectedAddress || `${this.state.newAddress.street}, ${this.state.newAddress.city}, ${this.state.newAddress.state} ${this.state.newAddress.zipcode}`,
            items: this.state.orderSummary,
            total_amount: this.state.totalAmount,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/orders/', orderData);
            console.log('Order placed successfully:', response.data);
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    handleAddressChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newAddress: {
                ...prevState.newAddress,
                [name]: value,
            },
        }));
    };

    render() {
        const { selectedAddress, newAddress, orderSummary, totalAmount } = this.state;

        return (
            <div className="orders-management">
                <h1>Select Address</h1>
                <select
                    value={selectedAddress}
                    onChange={(e) => this.setState({ selectedAddress: e.target.value })}
                >
                    <option value="">Select an address</option>
                    <option value="1234 Main St, San Jose, CA 95111">1234 Main St, San Jose, CA 95111</option>
                    {/* Add more addresses dynamically */}
                </select>

                <h2>Don't see your address? Add a new address:</h2>
                <input
                    type="text"
                    name="street"
                    placeholder="eg. 1234 Main St"
                    value={newAddress.street}
                    onChange={this.handleAddressChange}
                />
                <input
                    type="text"
                    name="apartment"
                    placeholder="eg. Apartment, studio, or floor"
                    value={newAddress.apartment}
                    onChange={this.handleAddressChange}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="eg. San Jose"
                    value={newAddress.city}
                    onChange={this.handleAddressChange}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="eg. CA"
                    value={newAddress.state}
                    onChange={this.handleAddressChange}
                />
                <input
                    type="text"
                    name="zipcode"
                    placeholder="eg. 95111"
                    value={newAddress.zipcode}
                    onChange={this.handleAddressChange}
                />

                <h2>Order Summary</h2>
                <ul>
                    {orderSummary.map((item, index) => (
                        <li key={index}>
                            {item.item} - Qty: {item.quantity} - ${item.price}
                        </li>
                    ))}
                </ul>
                <h3>Total: ${totalAmount.toFixed(2)}</h3>

                <button onClick={this.handlePlaceOrder}>Place Order</button>
            </div>
        );
    }
}

export default OrdersManagement;
