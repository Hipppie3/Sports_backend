import pool from '../db/pool.js';

const gameController = {
  // Create a new game
  createGame: async (req, res) => {
    const client = await pool.connect();
    try {
      const { game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points } = req.body;
      const query = 'INSERT INTO games (game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
      const result = await client.query(query, [game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  // Get all games
  getAllGames: async (req, res) => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          g.*, 
          ht.name as home_team_name, 
          at.name as away_team_name
        FROM games g
        JOIN teams ht ON g.home_team_id = ht.id
        JOIN teams at ON g.away_team_id = at.id
      `;
      const result = await client.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  // Get a game by ID
  getGameById: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          g.*, 
          ht.name as home_team_name, 
          at.name as away_team_name
        FROM games g
        JOIN teams ht ON g.home_team_id = ht.id
        JOIN teams at ON g.away_team_id = at.id
        WHERE g.id = $1
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  // Update a game
  updateGame: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points } = req.body;

      const checkQuery = 'SELECT id FROM games WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
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
      const result = await client.query(query, [game_date, game_time, home_team_id, away_team_id, location, video_url, home_team_points, away_team_points, id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  // Delete a game
  deleteGame: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const query = 'DELETE FROM games WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.json({ message: 'Game deleted' });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },

  // **New Dynamic Standings Function**
  getDynamicStandings: async (req, res) => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          t.id AS team_id, 
          t.name AS team_name,
          COUNT(CASE WHEN g.home_team_id = t.id AND g.home_team_points > g.away_team_points THEN 1 ELSE NULL END) +
          COUNT(CASE WHEN g.away_team_id = t.id AND g.away_team_points > g.home_team_points THEN 1 ELSE NULL END) AS wins,
          COUNT(CASE WHEN g.home_team_id = t.id AND g.home_team_points < g.away_team_points THEN 1 ELSE NULL END) +
          COUNT(CASE WHEN g.away_team_id = t.id AND g.away_team_points < g.home_team_points THEN 1 ELSE NULL END) AS losses,
          SUM(CASE WHEN g.home_team_id = t.id THEN g.home_team_points ELSE g.away_team_points END) AS points_for,
          SUM(CASE WHEN g.home_team_id = t.id THEN g.away_team_points ELSE g.home_team_points END) AS points_against,
          (COUNT(CASE WHEN g.home_team_id = t.id AND g.home_team_points > g.away_team_points THEN 1 ELSE NULL END) +
          COUNT(CASE WHEN g.away_team_id = t.id AND g.away_team_points > g.home_team_points THEN 1 ELSE NULL END))::float / COUNT(g.id) AS pct
        FROM teams t
        LEFT JOIN games g ON (t.id = g.home_team_id OR t.id = g.away_team_id)
        GROUP BY t.id
        ORDER BY pct DESC;
      `;

      const result = await client.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching standings:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  },
};

export default gameController;
