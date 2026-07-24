const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./db');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('./passport-setup');

// Connect to MongoDB but don't exit if connection fails
(async () => {
  const connected = await connectDB();
  if (!connected) {
    console.warn('Warning: MongoDB connection failed. Some features may not work properly.');
  }
})();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Create a JWT token for the authenticated user
  const token = req.user.getSignedJwtToken();
  
  // Redirect to the frontend with the token
  res.redirect(`http://localhost:3000/auth/success?token=${token}&userId=${req.user._id}`);
});

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);

});