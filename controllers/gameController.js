import pool from '../db/pool.js';

const gameController = {
  createGame: async (req, res) => {
    try {
      const { game_date, game_time, home_team_id, away_team_id, location, video_url } = req.body;
      const query = 'INSERT INTO games (game_date, game_time, home_team_id, away_team_id, location, video_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await pool.query(query, [game_date, game_time, home_team_id, away_team_id, location, video_url]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllGames: async (req, res) => {
    try {
      const query = 'SELECT * FROM games';
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getGameById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM games WHERE id = $1';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateGame: async (req, res) => {
    try {
      const { id } = req.params;
      const { game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points } = req.body;

      const checkQuery = 'SELECT id FROM games WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }

      const query = `
        UPDATE games 
        SET 
          game_date = COALESCE($1, game_date), 
          game_time = COALESCE($2, game_time), 
          home_team_id = COALESCE($3, home_team_id), 
          away_team_id = COALESCE($4, away_team_id), 
          location = COALESCE($5, location),
          video_url = COALESCE($6, video_url),
          home_team_points = COALESCE($7, home_team_points),
          away_team_points = COALESCE($8, away_team_points)
        WHERE id = $9 
        RETURNING *`;
      const result = await pool.query(query, [game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points, id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteGame: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM games WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.json({ message: 'Game deleted' });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default gameController;
