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
app.set("trust proxy", 1); // ADD THIS — tells Express to trust Render's proxy headers for protocol/host
const PORT = process.env.PORT || 5000;

// CORS middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // set this on Render to your Vercel URL, e.g. https://disastermanagement.vercel.app
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
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

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(
      `${frontendUrl}/auth/success?token=${token}&userId=${req.user._id}`,
    );
  },
);

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);

});