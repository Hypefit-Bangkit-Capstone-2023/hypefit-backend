import pgPool from '../../utils/pgPool.js';
import sql from 'sql-template-strings';

const userRepository = {
	async create({ firebase_user_id }) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(sql`
        INSERT INTO users (firebase_user_id, created_at)
        VALUES (${firebase_user_id}, NOW())
				RETURNING id
      `);
			db.release();
			return res.rows[0];
		} catch (error) {
			db.release();
			throw error;
		}
	},

	async findByFirebaseUserId(uid) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(sql`
        SELECT
          id,
          firebase_user_id,
          created_at
        FROM users
        WHERE firebase_user_id = ${uid}
      `);
			db.release();
			return res.rows[0];
		} catch (error) {
			db.release();
			throw error;
		}
	},
};

export default userRepository;
