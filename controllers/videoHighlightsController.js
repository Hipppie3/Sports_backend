import pool from '../db/pool.js';

const videoHighlightsController = {
  addVideoHighlight: async (req, res) => {
    try {
      const { player_id, video_url, description } = req.body;
      const query = 'INSERT INTO video_highlights (player_id, video_url, description) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [player_id, video_url, description]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding video highlight:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getVideoHighlightsByPlayerId: async (req, res) => {
    try {
      const { playerId } = req.params;
      const query = 'SELECT * FROM video_highlights WHERE player_id = $1';
      const result = await pool.query(query, [playerId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching video highlights:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateVideoHighlight: async (req, res) => {
    try {
      const { id } = req.params;
      const { video_url, description } = req.body;
      const query = `
        UPDATE video_highlights 
        SET 
          video_url = COALESCE($1, video_url), 
          description = COALESCE($2, description) 
        WHERE id = $3 
        RETURNING *`;
      const result = await pool.query(query, [video_url, description, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Video highlight not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating video highlight:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteVideoHighlight: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM video_highlights WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Video highlight not found' });
      }
      res.json({ message: 'Video highlight deleted' });
    } catch (error) {
      console.error('Error deleting video highlight:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default videoHighlightsController;
