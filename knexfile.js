import 'dotenv/config';

/**
 * @type {import("knex").Knex.Config}
 */
export default {
	client: 'postgresql',
	connection: process.env.DATABASE_URL,
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: 'knex_migrations',
		stub: './node_modules/knex/lib/migrations/migrate/stub/mjs.stub',
	},
};
