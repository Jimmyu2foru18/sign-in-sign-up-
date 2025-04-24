const express = require('express');
const router = express.Router();
const User = require('./User'); // Assuming you have a User model

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        
        // Basic validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create new user
        const user = new User({ name, username, email, password });
        await user.save();
        
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

module.exports = router;
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars - simplified config
dotenv.config();

// Connect to database
const connectDB = require('./db');
const { notFound, errorHandler } = require('./errorMiddleware');

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Simplified middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified routes setup
app.use('/api/users', require('./userRoutes'));

// Serve static files directly from the current directory
app.use(express.static(path.join(__dirname)));

// Simple root route
app.get('/', (req, res) => {
  res.send('API is running. Go to /signin.html or /signup.html to access the forms');
});


// Simplified error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;