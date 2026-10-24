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
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL, // Set this to the deployed Vite site origin.
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'local-development-session-secret-change-me',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/nearby', require('./routes/nearbyRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/api/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
} else {
  app.get('/api/auth/google', (_req, res) => {
    res.status(503).send('Google sign-in is not configured on this server.');
  });
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/auth/success?token=${token}&userId=${req.user._id}`,
    );
  },
);

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the Vite build from Express in production so the deployment needs one web service.
const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) res.send('API is running...');
  });
});

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && req.accepts('html')) {
    return res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
      if (error) next();
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);

});
