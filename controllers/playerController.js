import pool from '../db/pool.js';

const playerController = {
  createPlayer: async (req, res) => {
    try {
      const { first_name, last_name, position, sport, team_id } = req.body;
      const image = req.file ? req.file.buffer : null;

      const query = 'INSERT INTO players (first_name, last_name, position, sport, image, team_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await pool.query(query, [first_name, last_name, position, sport, image, team_id]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllPlayers: async (req, res) => {
    try {
      const query = `
        SELECT p.id, p.first_name, p.last_name, p.position, p.sport, encode(p.image, 'base64') as image, t.name as team_name
        FROM players p
        LEFT JOIN teams t ON p.team_id = t.id
      `;
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
      const playerQuery = `
        SELECT p.id, p.first_name, p.last_name, p.position, p.sport, encode(p.image, 'base64') as image, t.name as team_name
        FROM players p
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE p.id = $1
      `;
      const playerResult = await pool.query(playerQuery, [id]);
      if (playerResult.rows.length === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      const videoQuery = 'SELECT * FROM video_highlights WHERE player_id = $1';
      const videoResult = await pool.query(videoQuery, [id]);

      const player = playerResult.rows[0];
      player.video_highlights = videoResult.rows;

      res.json(player);
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updatePlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, position, sport, team_id } = req.body;
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
          image = COALESCE($5, image),
          team_id = COALESCE($6, team_id)
        WHERE id = $7 
        RETURNING *`;
      const result = await pool.query(query, [first_name, last_name, position, sport, image, team_id, id]);
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
