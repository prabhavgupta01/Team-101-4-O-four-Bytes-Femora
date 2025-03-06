const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (user && (await user.matchPassword(password))) {
      console.log('Password matched');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid credentials');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    console.log('Password update request received:', {
      userId: req.user._id,
      hasCurrentPassword: !!req.body.currentPassword,
      hasNewPassword: !!req.body.newPassword
    });

    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Current password and new password are required',
        received: { 
          hasCurrentPassword: !!currentPassword, 
          hasNewPassword: !!newPassword 
        }
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find user with password field included
    const user = await User.findById(req.user._id).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    console.log('Password updated successfully');

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid password format',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating password',
      details: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    console.log('Profile update request received:', {
      userId: req.user._id,
      body: req.body
    });

    const { name, email, dateOfBirth } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!name || !email || !dateOfBirth) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Name, email, and date of birth are required',
        received: { name, email, dateOfBirth }
      });
    }

    // Check if email is being changed and if it's already taken
    if (email !== req.user.email) {
      console.log('Email change detected, checking availability');
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.log('Email already in use');
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user profile
    console.log('Finding user...');
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updating user fields...');
    user.name = name;
    user.email = email;
    user.dateOfBirth = dateOfBirth;

    console.log('Saving updated user...');
    await user.save();

    console.log('Profile updated successfully');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth
    });
  } catch (error) {
    console.error('Profile update error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid profile data',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating profile',
      details: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  updateProfile
}; 