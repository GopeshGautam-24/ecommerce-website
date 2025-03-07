const API_URL = 'http://localhost:5000/api';

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
        setLoggedInUser(email); // Store email after successful login
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
