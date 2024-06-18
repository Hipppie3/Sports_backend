// controllers/playerController.js

import pool from '../db/pool.js';

const playerController = {
  createPlayer: async (req, res) => {
    try {
      const { first_name, last_name, position, sport } = req.body;
      const image = req.file ? req.file.buffer : null;

      const query = 'INSERT INTO players (first_name, last_name, position, sport, image) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const result = await pool.query(query, [first_name, last_name, position, sport, image]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllPlayers: async (req, res) => {
    try {
      const query = 'SELECT id, first_name, last_name, position, sport, encode(image, \'base64\') as image FROM players';
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getPlayerById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT id, first_name, last_name, position, sport, encode(image, \'base64\') as image FROM players WHERE id = $1';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updatePlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, position, sport } = req.body;
      const image = req.file ? req.file.buffer : null;

      const checkQuery = 'SELECT id FROM players WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }

      const query = `
        UPDATE players 
        SET 
          first_name = COALESCE($1, first_name), 
          last_name = COALESCE($2, last_name), 
          position = COALESCE($3, position), 
          sport = COALESCE($4, sport), 
          image = COALESCE($5, image) 
        WHERE id = $6 
        RETURNING *`;
      const result = await pool.query(query, [first_name, last_name, position, sport, image, id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deletePlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM players WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }
      res.json({ message: 'Player deleted' });
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default playerController;
