const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');
const reviewsFilePath = path.join(__dirname, 'reviews.json');
const userCartsPath = path.join(__dirname, 'user-carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper function to read users file
const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper function to write users file
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Helper function to read reviews file
const readReviews = () => {
    try {
        const data = fs.readFileSync(reviewsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper function to write reviews file
const writeReviews = (reviews) => {
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
};

// Helper function to read user carts
const readUserCarts = () => {
    try {
        const data = fs.readFileSync(userCartsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { carts: {} };
    }
};

// Helper function to write user carts
const writeUserCarts = (carts) => {
    fs.writeFileSync(userCartsPath, JSON.stringify(carts, null, 2));
};

// Helper function to read products file
const readProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { smartphones: [], tablets: [], accessories: [] };
    }
};

// Helper function to write products file
const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readUsers();
    
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    users.push({ email, password });
    writeUsers(users);

    res.status(201).json({ message: 'User created successfully' });
});


// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
});

app.get('/api/users', (req, res) => {
    const users = readUsers();
    res.status(200).json(users);
});

app.get('/api/users/:email', (req, res) => {
    const { email } = req.params;
    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // 200  = response.ok
});

app.put('/api/users/:email', (req, res) => {
    const { email } = req.params;
    const { password } = req.body;

    let users = readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    
    users[userIndex].password = password;
    writeUsers(users);

    res.status(200).json({ message: "User updated successfully" });
});

app.delete('/api/users/:email', (req, res) => {
    const { email } = req.params;

    let users = readUsers();
    const newUsers = users.filter(user => user.email !== email);

    if (users.length === newUsers.length) {
        return res.status(404).json({ error: "User not found" });
    }

    writeUsers(newUsers);

    res.status(200).json({ message: "User deleted successfully" });
});



// Review submission endpoint
app.post('/api/submit-review', (req, res) => {
    const reviewData = req.body;
    
    if (!reviewData) {
        return res.status(400).json({ error: 'Review data is required' });
    }

    const reviews = readReviews();
    reviewData.id = reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 1;
    reviewData.timestamp = new Date().toISOString();
    reviews.push(reviewData);
    writeReviews(reviews);

    res.status(201).json({ message: 'Review submitted successfully' });
});

app.get('/api/get-review',(req,res)=>{
    const reviews = readReviews(); 
    res.status(200).json(reviews); 
})

app.get('/api/get-review/:id',(req,res)=>{
    const reviews = readReviews(); 
    const reviews_id = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviews_id);

    if (review) {
        return res.status(200).json(review);
    }
    res.status(404).json({ message: "review not found" });
})

app.delete("/api/delete-review/:id",(req,res)=>{
    const reviews_id = req.params.id;
    const reviews = readReviews(); 
    for(let  i = 0;i<reviews.length;i++){
        if(reviews[i].id == reviews_id){
            reviews.splice(i,1);
            console.log(reviews);
            return res.status(200).json({message : "review Deleted Successfully"})
        }
        res.status(404).json({message:"review Not found..."})
    }
})

app.get('/api/cart/:email', (req, res) => {
    const { email } = req.params;
    const userCarts = readUserCarts();
    res.json(userCarts.carts[email] || []);
});


app.post('/api/cart/:email', (req, res) => {
    const { email } = req.params;
    const { cart } = req.body;
    const userCarts = readUserCarts();
    userCarts.carts[email] = cart;
    writeUserCarts(userCarts);
    res.json({ message: 'Cart updated successfully' });
});
app.put('/api/cart/:email/:productId', (req, res) => {
    const { email, productId } = req.params;
    const { quantity } = req.body;

    const userCarts = readUserCarts();

    if (!userCarts.carts[email]) {
        return res.status(404).json({ message: "Cart not found for this user" });
    }

    const cart = userCarts.carts[email];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    cart[productIndex].quantity = quantity;
    writeUserCarts(userCarts);

    res.status(200).json({ message: "Cart updated successfully", cart });
});

app.delete('/api/cart/:email/:productId', (req, res) => {
    const { email, productId } = req.params;

    const userCarts = readUserCarts();

    if (!userCarts.carts[email]) {
        return res.status(404).json({ message: "Cart not found for this user" });
    }

    let cart = userCarts.carts[email];
    const updatedCart = cart.filter(item => item.id !== productId);

    if (cart.length === updatedCart.length) {
        return res.status(404).json({ message: "Product not found in cart" });
    }

    userCarts.carts[email] = updatedCart;
    writeUserCarts(userCarts);

    res.status(200).json({ message: "Product removed from cart", cart: updatedCart });
});

// Products endpoints
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

app.get('/api/products/:category/:id', (req, res) => {
    const { category, id } = req.params;
    const products = readProducts();
    
    if (!products[category]) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    const product = products[category].find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

app.post('/api/products/:category', (req, res) => {
    const { category } = req.params;
    const newProduct = req.body;
    const products = readProducts();
    
    if (!products[category]) {
        return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Generate new ID based on category prefix
    const prefix = category.charAt(0);
    const existingIds = products[category].map(p => parseInt(p.id.substring(1)));
    const nextId = Math.max(...existingIds, 0) + 1;
    newProduct.id = `${prefix}${nextId}`;
    
    products[category].push(newProduct);
    writeProducts(products);
    
    res.status(201).json(newProduct);
});

app.put('/api/products/:category/:id', (req, res) => {
    const { category, id } = req.params;
    const updateData = req.body;
    const products = readProducts();
    
    if (!products[category]) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    const productIndex = products[category].findIndex(p => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    products[category][productIndex] = { ...products[category][productIndex], ...updateData };
    writeProducts(products);
    
    res.json(products[category][productIndex]);
});

app.delete('/api/products/:category/:id', (req, res) => {
    const { category, id } = req.params;
    const products = readProducts();
    
    if (!products[category]) {
        return res.status(404).json({ error: 'Category not found' });
    }
    
    const initialLength = products[category].length;
    products[category] = products[category].filter(p => p.id !== id);
    
    if (products[category].length === initialLength) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    writeProducts(products);
    res.json({ message: 'Product deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
