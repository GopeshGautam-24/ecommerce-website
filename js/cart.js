async function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cart = await getCart();
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateSummary([]);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeItem('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateSummary(cart);
}

function updateSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

async function updateQuantity(productId, change) {
    const cart = await getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            await removeItem(productId);
        } else {
            await saveCart(cart);
            await updateCartDisplay();
        }
    }
}

async function removeItem(productId) {
    const cart = (await getCart()).filter(item => item.id !== productId);
    await saveCart(cart);
    await updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!getLoggedInUser()) {
        const cartContainer = document.querySelector('.cart-container');
        cartContainer.innerHTML = `
            <div class="login-prompt">
                <h2>Please login to view your cart</h2>
                <a href="login.html" class="login-btn">Login Now</a>
            </div>
        `;
        return;
    }
    updateCartDisplay();
    
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!isLoggedIn()) {
            alert('Please login to proceed with checkout');
            window.location.href = 'login.html';
            return;
        }
        alert('Proceeding to checkout...');
        // Add checkout logic here
    });
});
