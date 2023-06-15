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
};

export default recommendationRepository;
