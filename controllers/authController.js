import bcrypt from 'bcrypt';
import pool from '../db/pool.js';

const authController = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;
    console.log('Request Headers:', req.headers); // Log request headers
    console.log('Request Body:', req.body); // Log request body
    try {
      console.log('Registering user:', username); // Log the username
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword); // Log the hashed password
      await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
      console.log('User registered successfully');
      res.status(201).send('User registered');
    } catch (err) {
      console.error('Error registering user:', err); // Log the error
      res.status(500).send('Error registering user');
    }
  },

  loginUser: (req, res) => {
    res.send('Logged in');
  },

  logoutUser: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.send('Logged out');
    });
  },

  checkAuth: (req, res) => {
    if (req.isAuthenticated()) {
      res.send({ authenticated: true, user: req.user });
    } else {
      res.send({ authenticated: false });
    }
  },
};

export default authController;
