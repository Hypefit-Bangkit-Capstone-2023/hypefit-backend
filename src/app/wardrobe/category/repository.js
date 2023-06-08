import SQL from 'sql-template-strings';
import pgPool from '../../../utils/pgPool.js';

const wardrobeItemCategoryRepository = {
	async findById(id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
        SELECT
          id,
          name
        FROM wardrobe_item_categories
        WHERE id = ${id}
      `);
			db.release();
			return res.rows[0];
		} catch (error) {
			db.release();
			throw error;
		}
	},
};

export default wardrobeItemCategoryRepository;
