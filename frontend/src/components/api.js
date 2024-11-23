const BASE_URL = 'http://localhost:8000/api';

export const createOrder = async (orderData) => {
    const response = await fetch(`${BASE_URL}/orders/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return await response.json();
};
