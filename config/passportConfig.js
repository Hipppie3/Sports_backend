import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize user from the session
passport.deserializeUser((username, done) => {
  const user = { username }; // Since we have only one user, we can just return the username
  done(null, user);
});

// Configure local strategy for passport
passport.use(new LocalStrategy((username, password, done) => {
  const hardcodedUsername = process.env.ADMIN_USERNAME;
  const storedHashedPassword = process.env.ADMIN_PASSWORD;

  if (username !== hardcodedUsername) {
    return done(null, false, { message: 'Incorrect username.' });
  }

  bcrypt.compare(password, storedHashedPassword, (err, res) => {
    if (err) return done(err);
    if (res) {
      const user = { username }; // Use the hardcoded username as the user object
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  });
}));

export default passport;
