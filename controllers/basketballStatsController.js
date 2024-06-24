import pool from '../db/pool.js';

const basketballStatsController = {
  getStatsByPlayerId: async (req, res) => {
    try {
      const { player_id } = req.params;
      const query = `
        SELECT bs.*, g.game_date
        FROM basketball_stats bs
        JOIN games g ON bs.game_id = g.id
        WHERE bs.player_id = $1
      `;
      const result = await pool.query(query, [player_id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
getStatsByGameId: async (req, res) => {
  try {
    const { game_id } = req.params;
    const query = `
      SELECT bs.*, p.first_name || ' ' || p.last_name AS player_name, p.team_id
      FROM basketball_stats bs
      JOIN players p ON bs.player_id = p.id
      WHERE bs.game_id = $1
    `;
    const result = await pool.query(query, [game_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},


  createStats: async (req, res) => {
    try {
      const { player_id, game_id, two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov } = req.body;

      const reb = oreb + dreb;
      const fg_percentage = ((two_pm + three_pm) / (two_pa + three_pa)) * 100 || 0;
      const two_p_percentage = (two_pm / two_pa) * 100 || 0;
      const three_p_percentage = (three_pm / three_pa) * 100 || 0;
      const ft_percentage = (ftm / fta) * 100 || 0;
      const fgm = two_pm + three_pm;
      const fga = two_pa + three_pa;
      const pts = ftm + (3 * three_pm) + (2 * two_pm);

      const query = `
        INSERT INTO basketball_stats (player_id, game_id, pts, fgm, fga, fg_percentage, two_pm, two_pa, two_p_percentage, three_pm, three_pa, three_p_percentage, ftm, fta, ft_percentage, oreb, dreb, reb, ast, stl, blk, tov)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`;
      const values = [player_id, game_id, pts, fgm, fga, fg_percentage, two_pm, two_pa, two_p_percentage, three_pm, three_pa, three_p_percentage, ftm, fta, ft_percentage, oreb, dreb, reb, ast, stl, blk, tov];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateStats: async (req, res) => {
    try {
      const { id } = req.params;
      const { game_id, two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov } = req.body;

      const reb = oreb + dreb;
      const fg_percentage = ((two_pm + three_pm) / (two_pa + three_pa)) * 100 || 0;
      const two_p_percentage = (two_pm / two_pa) * 100 || 0;
      const three_p_percentage = (three_pm / three_pa) * 100 || 0;
      const ft_percentage = (ftm / fta) * 100 || 0;
      const fgm = two_pm + three_pm;
      const fga = two_pa + three_pa;
      const pts = ftm + (3 * three_pm) + (2 * two_pm);

      const query = `
        UPDATE basketball_stats 
        SET 
          game_id = $1, two_pm = $2, two_pa = $3, three_pm = $4, three_pa = $5, ftm = $6, fta = $7, oreb = $8, dreb = $9, ast = $10, stl = $11, blk = $12, tov = $13,
          reb = $14, fg_percentage = $15, two_p_percentage = $16, three_p_percentage = $17, ft_percentage = $18, fgm = $19, fga = $20, pts = $21,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $22 RETURNING *`;
      const values = [game_id, two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov, reb, fg_percentage, two_p_percentage, three_p_percentage, ft_percentage, fgm, fga, pts, id];
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteStats: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM basketball_stats WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Stats not found' });
      }
      res.json({ message: 'Stats deleted' });
    } catch (error) {
      console.error('Error deleting stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};



export default basketballStatsController;
