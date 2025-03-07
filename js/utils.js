const API_URL = 'http://localhost:5000/api';

// Auth functions
function setLoggedInUser(email) {
    localStorage.setItem('userEmail', email);
}

function getLoggedInUser() {
    return localStorage.getItem('userEmail');
}

function isLoggedIn() {
    return !!getLoggedInUser();
}

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Cart functions
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

// API functions
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        setLoggedInUser(email);
        return data;
    } catch (error) {
        throw error;
    }
}

async function signupUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// Cart counter function
function updateCartCounter() {
    getCart().then(cart => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'block' : 'none';
        }
    });
}
