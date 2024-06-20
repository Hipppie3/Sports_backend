import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passportConfig.js';
import authRoutes from './routes/auth.js';
import playerRouter from './routes/player.js';
import basketballStatsRouter from './routes/basketballStats.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific origin and credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Log session information for debugging
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api', playerRouter);
app.use('/api', basketballStatsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
