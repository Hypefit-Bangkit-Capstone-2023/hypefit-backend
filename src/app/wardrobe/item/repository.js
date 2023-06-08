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

	async findByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					wardrobe_items.id,
					wardrobe_items.name,
					wardrobe_item_categories.id AS category_id,
					wardrobe_item_categories.name AS category_name,
					wardrobe_items.image_key,
					wardrobe_items.created_at
				FROM wardrobe_items
				INNER JOIN wardrobe_item_categories
					ON wardrobe_item_categories.id = wardrobe_items.wardrobe_item_category_id
				WHERE
					wardrobe_items.user_id = ${user_id}
					AND wardrobe_items.deleted_at IS NULL
			`);
			db.release();
			return res.rows;
		} catch (error) {
			db.release();
			throw error;
		}
	},

	async findForUpdate(id, user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					wardrobe_items.id,
					wardrobe_items.name,
					wardrobe_item_categories.id AS category_id,
					wardrobe_items.image_key
				FROM wardrobe_items
				INNER JOIN wardrobe_item_categories
					ON wardrobe_item_categories.id = wardrobe_items.wardrobe_item_category_id
				WHERE
					wardrobe_items.id = ${id}
					AND wardrobe_items.user_id = ${user_id}
					AND deleted_at IS NULL
			`);
			db.release();
			return res.rows[0];
		} catch (error) {
			db.release();
			throw error;
		}
	},

	async update({ id, name, wardrobe_item_category_id, image_key }) {
		const db = await pgPool.connect();
		try {
			await db.query(SQL`
        UPDATE wardrobe_items
				SET
					name = ${name},
					wardrobe_item_category_id = ${wardrobe_item_category_id},
					image_key = ${image_key}
				WHERE id = ${id}
      `);
			db.release();
		} catch (error) {
			db.release();
			throw error;
		}
	},
};

export default wardrobeItemRepository;
