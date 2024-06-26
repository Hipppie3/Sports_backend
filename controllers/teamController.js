import pool from '../db/pool.js';

const teamController = {
  createTeam: async (req, res) => {
    const client = await pool.connect();
    try {
      const { name, sport } = req.body;
      const image = req.file ? req.file.buffer : null;

      const query = 'INSERT INTO teams (name, sport, image) VALUES ($1, $2, $3) RETURNING *';
      const result = await client.query(query, [name, sport, image]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating team:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      client.release();
    }
  },

  getAllTeams: async (req, res) => {
    const client = await pool.connect();
    try {
      const query = 'SELECT id, name, sport, encode(image, \'base64\') as image FROM teams';
      const result = await client.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching teams:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      client.release();
    }
  },

  getTeamById: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const query = 'SELECT id, name, sport, encode(image, \'base64\') as image FROM teams WHERE id = $1';
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching team:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      client.release();
    }
  },

  updateTeam: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { name, sport } = req.body;
      const image = req.file ? req.file.buffer : null;

      const checkQuery = 'SELECT id FROM teams WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Team not found' });
      }

      const query = `
        UPDATE teams 
        SET 
          name = COALESCE($1, name), 
          sport = COALESCE($2, sport), 
          image = COALESCE($3, image)
        WHERE id = $4 
        RETURNING *`;
      const result = await client.query(query, [name, sport, image, id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating team:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      client.release();
    }
  },

  deleteTeam: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const query = 'DELETE FROM teams WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.json({ message: 'Team deleted' });
    } catch (error) {
      console.error('Error deleting team:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      client.release();
    }
  },
};

export default teamController;
