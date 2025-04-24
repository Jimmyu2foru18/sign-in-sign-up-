const User = require('./User');
const { generateToken } = require('./auth');

// @desc    Register a new user - simplified version
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Simple check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with minimal validation
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
};

// @desc    Auth user & get token - simplified version
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Simplified login - accept either email or username
    const user = await User.findOne(
      email ? { email } : { username }
    );

    // Simple password check
    if (user && (await user.matchPassword(password))) {
      // Return user data with token
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({ message: 'Invalid login details' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Login failed' });
  }
};

// @desc    Get user profile - simplified version
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Simplified profile retrieval
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(400).json({ message: 'Could not retrieve profile' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };