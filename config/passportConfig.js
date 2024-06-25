import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from '../db/pool.js'; // Ensure the path is correct
import dotenv from 'dotenv';

dotenv.config();

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  pool.query('SELECT id, username FROM users WHERE id = $1', [id], (err, result) => {
    if (err) return done(err);
    done(null, result.rows[0]);
  });
});

// Configure local strategy for passport
passport.use(new LocalStrategy((username, password, done) => {
  pool.query('SELECT id, username, password FROM users WHERE username = $1', [username], (err, result) => {
    if (err) return done(err);
    if (result.rows.length === 0) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const user = result.rows[0];

    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

export default passport;
