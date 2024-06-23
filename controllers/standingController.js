import pool from '../db/pool.js';

const standingController = {
  createStanding: async (req, res) => {
    try {
      const { team_id, wins, losses, games_played, games_left, points_for, points_allowed } = req.body;
      const query = 'INSERT INTO standings (team_id, wins, losses, games_played, games_left, points_for, points_allowed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const result = await pool.query(query, [team_id, wins, losses, games_played, games_left, points_for, points_allowed]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating standing:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllStandings: async (req, res) => {
    try {
      const query = 'SELECT * FROM standings';
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching standings:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getStandingById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM standings WHERE id = $1';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Standing not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching standing:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateStanding: async (req, res) => {
    try {
      const { id } = req.params;
      const { team_id, wins, losses, games_played, games_left, points_for, points_allowed } = req.body;

      const checkQuery = 'SELECT id FROM standings WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Standing not found' });
      }

      const query = `
        UPDATE standings 
        SET 
          team_id = COALESCE($1, team_id), 
          wins = COALESCE($2, wins), 
          losses = COALESCE($3, losses), 
          games_played = COALESCE($4, games_played), 
          games_left = COALESCE($5, games_left), 
          points_for = COALESCE($6, points_for), 
          points_allowed = COALESCE($7, points_allowed)
        WHERE id = $8 
        RETURNING *`;
      const result = await pool.query(query, [team_id, wins, losses, games_played, games_left, points_for, points_allowed, id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating standing:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteStanding: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM standings WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Standing not found' });
      }
      res.json({ message: 'Standing deleted' });
    } catch (error) {
      console.error('Error deleting standing:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default standingController;