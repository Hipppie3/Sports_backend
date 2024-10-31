import pool from '../db/pool.js';

const leagueController = {
  createLeague: async (req, res) => {
    const client = await pool.connect();
    try {
      const { name, start_date, end_date } = req.body;
      const query = 'INSERT INTO leagues (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *';
      const result = await client.query(query, [name, start_date, end_date]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating league:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  getLeagues: async (req, res) => {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM leagues';
      const result = await client.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  getLeagueById: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM leagues WHERE id = $1';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'League not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching league by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  }
};

export default leagueController;
