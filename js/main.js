function initializeSlideshow() {
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Change slide every 1.5 seconds
    setInterval(nextSlide, 1500);
}

async function fetchProducts() {
    try {
        const response = await fetch('./data/products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

async function addToCart(product) {
    if (!isLoggedIn()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const cart = await getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    await saveCart(cart);
    alert('Product added to cart!');
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                </div>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" data-product='${JSON.stringify(product)}'>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function addNavigationControls(sectionId) {
    const section = document.getElementById(sectionId);
    const grid = section.querySelector('.product-grid');
    
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    
    prevBtn.className = 'nav-arrow prev';
    nextBtn.className = 'nav-arrow next';
    
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    section.appendChild(prevBtn);
    section.appendChild(nextBtn);
}

async function renderProducts() {
    const products = await fetchProducts();
    if (!products) return;

    // Render featured products with more items
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        const featuredProducts = [
            ...products.smartphones.slice(0, 3),  // Get first 3 smartphones
            ...products.tablets.slice(0, 3),      // Get first 3 tablets
            ...products.accessories.slice(0, 2)    // Get first 2 accessories
        ];

        // Add some special featured products
        const specialFeatured = [
            {
                id: 'special-1',
                name: 'Premium Wireless Bundle',
                description: 'Exclusive bundle including wireless earbuds, charging pad, and power bank',
                price: 199.99,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500'
            },
            {
                id: 'special-2',
                name: 'Smart Home Starter Kit',
                description: 'Complete smart home package with hub, smart bulbs, and security camera',
                price: 299.99,
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500'
            }
        ];

        // Combine regular and special featured products
        const allFeatured = [...featuredProducts, ...specialFeatured];
        
        featuredGrid.innerHTML = allFeatured
            .map(item => createProductCard(item))
            .join('');
        
        addNavigationControls('products'); // Changed back to 'products'
    }

    // Render other sections
    const sections = ['smartphones', 'tablets', 'accessories'];
    
    sections.forEach(section => {
        const grid = document.getElementById(`${section}-grid`);
        if (grid) {
            // Duplicate products to create more cards
            const extendedProducts = [...products[section]];
            for (let i = 0; i < 2 ; i++) {
                products[section].forEach(product => {
                    const clone = { ...product };
                    clone.id = `${clone.id}-${i}`;
                    extendedProducts.push(clone);
                });
            }
            
            grid.innerHTML = extendedProducts
                .map(item => createProductCard(item))
                .join('');
                
            addNavigationControls(`${section}`);
        }
    });

    // Add cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const product = JSON.parse(button.dataset.product);
            await addToCart(product);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSlideshow();
    renderProducts();
});