/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('recommendations', (table) => {
		table.increments('id').primary();
		table.integer('user_id').index().references('id').inTable('users').notNullable();
		table.jsonb('image_keys').notNullable();
		table.jsonb('valid_matches').notNullable();
		table.jsonb('dominant_colors').notNullable();
		table.jsonb('color_descriptions').notNullable();
		table.timestamp('created_at', { useTz: true }).notNullable();
		table.timestamp('deleted_at', { useTz: true });
		table.timestamp('liked_at', { useTz: true });
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
