import SQL from 'sql-template-strings';
import pgPool from '../../../utils/pgPool.js';
import knex from '../../../utils/knex.js';

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

	async findByUserId(user_id, filter, descending) {
		const qb = knex('wardrobe_items')
			.select(
				'wardrobe_items.id',
				'wardrobe_items.name',
				'wardrobe_item_category_groups.id AS category_group_id',
				'wardrobe_item_category_groups.name AS category_group_name',
				'wardrobe_item_categories.id AS category_id',
				'wardrobe_item_categories.name AS category_name',
				'wardrobe_items.image_key',
				'wardrobe_items.created_at'
			)
			.innerJoin(
				'wardrobe_item_categories',
				'wardrobe_item_categories.id',
				'wardrobe_items.wardrobe_item_category_id'
			)
			.innerJoin(
				'wardrobe_item_category_groups',
				'wardrobe_item_category_groups.id',
				'wardrobe_item_categories.wardrobe_item_category_group_id'
			)
			.where('wardrobe_items.user_id', user_id)
			.where('wardrobe_items.deleted_at', null);

		if (filter?.category_id) {
			qb.where('wardrobe_item_categories.id', filter.category_id);
		}

		if (descending) {
			qb.orderBy('wardrobe_items.created_at', 'desc');
		}

		const res = await qb;
		return res;
	},

	async findByIdAndUserId(id, user_id) {
		const qb = knex('wardrobe_items')
			.select(
				'wardrobe_items.id',
				'wardrobe_items.name',
				'wardrobe_item_category_groups.id AS category_group_id',
				'wardrobe_item_category_groups.name AS category_group_name',
				'wardrobe_item_categories.id AS category_id',
				'wardrobe_item_categories.name AS category_name',
				'wardrobe_items.image_key',
				'wardrobe_items.created_at'
			)
			.innerJoin(
				'wardrobe_item_categories',
				'wardrobe_item_categories.id',
				'wardrobe_items.wardrobe_item_category_id'
			)
			.innerJoin(
				'wardrobe_item_category_groups',
				'wardrobe_item_category_groups.id',
				'wardrobe_item_categories.wardrobe_item_category_group_id'
			)
			.where('wardrobe_items.id', id)
			.where('wardrobe_items.user_id', user_id)
			.where('wardrobe_items.deleted_at', null);

		const res = await qb;
		return res[0];
	},

	async findForUpdateOrDelete(id, user_id) {
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

	async countByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					COUNT(*) AS value
				FROM wardrobe_items
				WHERE
					user_id = ${user_id}
					AND deleted_at IS NULL
			`);
			db.release();
			return res.rows[0].value;
		} catch (error) {
			db.release();
			throw error;
		}
	},

	async countPerCategoryGroupByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					wardrobe_item_category_groups.id AS category_group_id,
					wardrobe_item_category_groups.name AS category_group_name,
					COUNT(*) AS count
				FROM wardrobe_items
				INNER JOIN wardrobe_item_categories
					ON wardrobe_item_categories.id = wardrobe_items.wardrobe_item_category_id
				INNER JOIN wardrobe_item_category_groups
					ON wardrobe_item_category_groups.id = wardrobe_item_categories.wardrobe_item_category_group_id
				WHERE
					wardrobe_items.user_id = ${user_id}
					AND wardrobe_items.deleted_at IS NULL
				GROUP BY
					wardrobe_item_category_groups.id,
					wardrobe_item_category_groups.name
			`);
			return res.rows;
		} finally {
			db.release();
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

	async delete(id) {
		const db = await pgPool.connect();
		try {
			await db.query(SQL`
				UPDATE wardrobe_items
				SET deleted_at = NOW()
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
