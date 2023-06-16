import SQL from 'sql-template-strings';
import pgPool from '../../utils/pgPool.js';

const recommendationRepository = {
	async findByUserId(userId) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					id,
					image_keys,
					created_at,
					liked_at
				FROM recommendations
				WHERE
					user_id = ${userId}
					AND deleted_at IS NULL
				ORDER BY created_at DESC
			`);
			return res.rows;
		} finally {
			db.release();
		}
	},

	async findByIdAndUserId(id, user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					id,
					image_keys,
					created_at,
					deleted_at,
					liked_at
				FROM recommendations
				WHERE
					id = ${id}
					AND user_id = ${user_id}
			`);
			return res.rows[0];
		} finally {
			db.release();
		}
	},

	async findLikedByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					id,
					image_keys,
					created_at,
					deleted_at,
					liked_at
				FROM recommendations
				WHERE
					user_id = ${user_id}
					AND liked_at IS NOT NULL
				ORDER BY liked_at DESC
			`);
			return res.rows;
		} finally {
			db.release();
		}
	},

	async countLikedByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					COUNT(*) as value
				FROM recommendations
				WHERE
					user_id = ${user_id}
					AND liked_at IS NOT NULL
			`);
			return res.rows[0].value;
		} finally {
			db.release();
		}
	},

	async create({ user_id, image_keys, valid_matches, dominant_colors, color_descriptions }) {
		const db = await pgPool.connect();
		try {
			await db.query(SQL`
				INSERT INTO recommendations (
					user_id,
					image_keys,
					valid_matches,
					dominant_colors,
					color_descriptions,
					created_at
				)
				VALUES (
					${user_id},
					${image_keys},
					${valid_matches},
					${dominant_colors},
					${color_descriptions},
					NOW()
				)
			`);
		} finally {
			db.release();
		}
	},

	async updateLikedAtById(id, liked_at) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				UPDATE recommendations
				SET liked_at = ${liked_at}
				WHERE id = ${id}
			`);
			return res.rows;
		} finally {
			db.release();
		}
	},
};

export default recommendationRepository;
