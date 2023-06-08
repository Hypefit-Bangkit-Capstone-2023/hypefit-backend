import knex from 'knex';
import config from '../config.js';

export default knex({
	client: 'pg',
	connection: config.databaseUrl,
});
