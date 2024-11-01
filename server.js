import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passportConfig.js';
import authRoutes from './routes/auth.js';
import playerRouter from './routes/player.js';
import basketballStatsRouter from './routes/basketballStats.js';
import videoHighlightsRouter from './routes/videoHighlights.js';
import gameRouter from './routes/game.js';
import teamRouter from './routes/team.js';
import leagueRouter from './routes/league.js';  // Import the league routes
import scheduleRouter from './routes/schedule.js';  // Import the schedule routes
import pool from './db/pool.js';  // Ensure the path is correct

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const PgSession = pgSession(session);

// Enable CORS with specific origin and credentials
app.use(cors({
  origin: ['https://hipppiesports.netlify.app', 'http://localhost:5173'],
  credentials: true,
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session with PostgreSQL store
app.use(session({
  store: new PgSession({
    pool: pool,  // Connection pool
    tableName: 'sessions',  // Use the correct table name
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
}));

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log session information for debugging
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api', playerRouter);
app.use('/api', basketballStatsRouter);
app.use('/api', videoHighlightsRouter);
app.use('/api', gameRouter);
app.use('/api', teamRouter);
app.use('/api', leagueRouter);  // Add league routes
app.use('/api', scheduleRouter);  // Add schedule routes

// Check connected database
pool.query('SELECT current_database()', (err, res) => {
  if (err) {
    console.error('Error executing query:', err.stack);
  } else {
    console.log('Connected to database:', res.rows[0].current_database);
  }
});

// Default route to handle root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Basketball Backend API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
