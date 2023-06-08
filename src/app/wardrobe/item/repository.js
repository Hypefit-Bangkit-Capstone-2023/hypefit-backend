import SQL from 'sql-template-strings';
import pgPool from '../../../utils/pgPool.js';

const wardrobeItemRepository = {
	async create({ user_id, name, wardrobe_item_category_id, image_key }) {
		const db = await pgPool.connect();
		try {
			await db.query(SQL`
        INSERT INTO wardrobe_items (user_id, name, wardrobe_item_category_id, image_key, created_at)
        VALUES (${user_id}, ${name}, ${wardrobe_item_category_id}, ${image_key}, NOW())
      `);
			db.release();
		} catch (error) {
			db.release();
			throw error;
		}
	},
};

export default wardrobeItemRepository;
