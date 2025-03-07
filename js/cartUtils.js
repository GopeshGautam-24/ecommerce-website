const API_URL = 'http://localhost:5000/api';

async function getCart() {
    const userEmail = getLoggedInUser();
    if (!userEmail) return [];
    
    try {
        const response = await fetch(`${API_URL}/cart/${userEmail}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

async function saveCart(cart) {
    const userEmail = getLoggedInUser();
    if (!userEmail) {
        alert('Please login to save your cart');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        await fetch(`${API_URL}/cart/${userEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart }),
        });
        updateCartCounter();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}
