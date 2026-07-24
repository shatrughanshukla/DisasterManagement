const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer storage for profile pictures
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images Only!');
  }
}

// Configure multer upload
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (user) {
      return res.status(200).json({ available: false });
    }
    
    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (user) {
      return res.status(200).json({ available: false });
    }
    
    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register User
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    console.log('Registration attempt with data:', req.body);
    const { name, username, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !username || !email || !password || !role) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
      // Check if user already exists by email
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        console.log('Registration failed: Email already in use -', email);
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Check if username is taken
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        console.log('Registration failed: Username already taken -', username);
        return res.status(400).json({ message: 'Username already taken' });
      }
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Continue with registration even if database checks fail
      console.log('Warning: Skipping duplicate checks due to database error');
    }

    // Create user with profile picture if uploaded
    const userData = {
      name,
      username,
      email,
      password,
      role,
    };

    // Add profile picture path if file was uploaded
    if (req.file) {
      console.log('Profile picture uploaded:', req.file.path);
      userData.profilePic = `/${req.file.path}`;
    } else {
      console.log('No profile picture uploaded, using default');
      userData.profilePic = '/uploads/default.png';
    }

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    
    try {
      const user = await User.create(userData);

      if (user) {
        console.log('User created successfully:', user._id);
        // Generate JWT token
        const token = user.getSignedJwtToken();
        console.log('Token generated successfully');
        
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          token: token,
        });
      } else {
        console.log('Registration failed: Invalid user data');
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (createError) {
      console.error('User creation error:', createError);
      // Check for duplicate key error
      if (createError.code === 11000) {
        const field = Object.keys(createError.keyPattern)[0];
        return res.status(400).json({ message: `${field} already exists` });
      }
      throw createError; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration process' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  // Validate input
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      console.log('Login successful for user:', user.username);
      
      // Generate JWT token
      const token = user.getSignedJwtToken();
      console.log('Token generated successfully');
      
      // Send successful response
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login process' });
  }
});

// @desc    Refresh user token
// @route   POST /api/auth/refresh
// @access  Public (with expired token)
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Get the JWT secret from environment variables
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify the token without checking expiration
    let decoded;
    try {
      // First try normal verification (will fail if expired)
      decoded = require('jsonwebtoken').verify(token, JWT_SECRET);
      
      // If we get here, token is still valid, just return the same token
      return res.json({ token, message: 'Token still valid' });
    } catch (error) {
      // If error is not about expiration, reject the request
      if (error.name !== 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
      }
      
      // For expired tokens, decode without verification to get the payload
      const decodedPayload = require('jsonwebtoken').decode(token);
      if (!decodedPayload || !decodedPayload.id) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }
      
      // Get user from database
      const user = await User.findById(decodedPayload.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Generate new token using the user's method
      const newToken = user.getSignedJwtToken();
      
      res.json({
        token: newToken,
        message: 'Token refreshed successfully'
      });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;