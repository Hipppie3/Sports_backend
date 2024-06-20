import pool from '../db/pool.js';

const basketballStatsController = {
  getStatsByPlayerId: async (req, res) => {
    try {
      const { player_id } = req.params;
      const query = 'SELECT * FROM basketball_stats WHERE player_id = $1';
      const result = await pool.query(query, [player_id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  createStats: async (req, res) => {
    try {
      const { player_id, game_date, two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov } = req.body;

      // Calculate derived stats
      const reb = oreb + dreb;
      const fg_percentage = ((two_pm + three_pm) / (two_pa + three_pa)) * 100 || 0;
      const two_p_percentage = (two_pm / two_pa) * 100 || 0;
      const three_p_percentage = (three_pm / three_pa) * 100 || 0;
      const ft_percentage = (ftm / fta) * 100 || 0;
      const fgm = two_pm + three_pm;
      const fga = two_pa + three_pa;
      const pts = ftm + (3 * three_pm) + (2 * two_pm);

      const query = `
        INSERT INTO basketball_stats (player_id, game_date, pts, fgm, fga, fg_percentage, two_pm, two_pa, two_p_percentage, three_pm, three_pa, three_p_percentage, ftm, fta, ft_percentage, oreb, dreb, reb, ast, stl, blk, tov)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`;
      const values = [player_id, game_date, pts, fgm, fga, fg_percentage, two_pm, two_pa, two_p_percentage, three_pm, three_pa, three_p_percentage, ftm, fta, ft_percentage, oreb, dreb, reb, ast, stl, blk, tov];
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
      const { two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov } = req.body;

      // Calculate derived stats
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
          two_pm = $1, two_pa = $2, three_pm = $3, three_pa = $4, ftm = $5, fta = $6, oreb = $7, dreb = $8, ast = $9, stl = $10, blk = $11, tov = $12,
          reb = $13, fg_percentage = $14, two_p_percentage = $15, three_p_percentage = $16, ft_percentage = $17, fgm = $18, fga = $19, pts = $20,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $21 RETURNING *`;
      const values = [two_pm, two_pa, three_pm, three_pa, ftm, fta, oreb, dreb, ast, stl, blk, tov, reb, fg_percentage, two_p_percentage, three_p_percentage, ft_percentage, fgm, fga, pts, id];
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
