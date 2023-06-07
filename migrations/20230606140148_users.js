/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('users', (table) => {
		table.increments('id').primary();
		table.string('firebase_user_id').unique().notNullable();
		table.timestamp('created_at', { useTz: true }).notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
