import pool from '../db/pool.js';

const scheduleController = {
  createSchedule: async (req, res) => {
    const client = await pool.connect();
    try {
      const { league_id, game_date, game_time, home_team_id, away_team_id, location } = req.body;
      const query = `
        INSERT INTO schedules (league_id, game_date, game_time, home_team_id, away_team_id, location) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await client.query(query, [league_id, game_date, game_time, home_team_id, away_team_id, location]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

getSchedules: async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT s.id, s.league_id, s.game_date, s.game_time, s.location,
      ht.name AS home_team_name, at.name AS away_team_name
      FROM schedules s
      LEFT JOIN teams ht ON s.home_team_id = ht.id
      LEFT JOIN teams at ON s.away_team_id = at.id
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
},


  getScheduleById: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const result = await client.query('SELECT * FROM schedules WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching schedule by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  }
};

export default scheduleController;
