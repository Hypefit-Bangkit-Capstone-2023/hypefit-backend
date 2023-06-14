import SQL from 'sql-template-strings';
import pgPool from '../../utils/pgPool.js';

const taskRepository = {
	async create({ user_id, data }) {
		const db = await pgPool.connect();
		try {
			await db.query(SQL`
        INSERT INTO tasks (user_id, status, data, created_at)
        VALUES (${user_id}, ${TaskStatus.PENDING}, ${data}, NOW())
      `);
		} finally {
			console.log('finally');
			db.release();
		}
	},

	async isPendingOrStartedByUserId(user_id) {
		const db = await pgPool.connect();
		try {
			const res = await db.query(SQL`
				SELECT
					COUNT(*) AS count
				FROM tasks
				WHERE
					user_id = ${user_id}
					AND (
						status = ${TaskStatus.PENDING}
						OR status = ${TaskStatus.STARTED}
					)
			`);
			return res.rows[0]?.count > 0;
		} finally {
			db.release();
		}
	},
};

export default taskRepository;

export const TaskStatus = {
	PENDING: 'pending',
	STARTED: 'started',
	COMPLETED: 'completed',
	FAILED: 'failed',
};
