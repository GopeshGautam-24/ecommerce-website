function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function updateNavbar() {
    const userEmail = getLoggedInUser();
    const userSection = document.querySelector('.user-section');
    
    if (userEmail) {
        userSection.innerHTML = `
            <span class="user-email">${userEmail}</span>
            <button onclick="logout()" class="logout-btn">Logout</button>
        `;
        document.querySelector('.logbtn').style.display = "none";
    }
    updateCartCounter();
}

// Update cart counter when cart changes
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCounter();
    }
});

// Call this when the page loads
document.addEventListener('DOMContentLoaded', updateNavbar);
