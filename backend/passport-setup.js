const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          done(null, currentUser);
        } else {
          // Generate a random username based on display name and random string
          const randomString = Math.random().toString(36).substring(2, 8);
          const username = profile.displayName.toLowerCase().replace(/\s+/g, '_') + '_' + randomString;
          
          const newUser = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            username: username, // Add username field
            role: 'student',
            password: Math.random().toString(36).slice(-8), // Placeholder password
          }).save();
          done(null, newUser);
        }
      } catch (error) {
        console.error('Error in Google authentication strategy:', error);
        done(error, null);
      }
    }
  )
);