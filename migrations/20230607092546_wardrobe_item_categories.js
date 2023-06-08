/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('wardrobe_item_categories', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
