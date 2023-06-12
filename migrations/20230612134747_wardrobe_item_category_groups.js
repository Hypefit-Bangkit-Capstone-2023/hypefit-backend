/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.createTable('wardrobe_item_category_groups', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
	});

	return knex.schema.alterTable('wardrobe_item_categories', (table) => {
		table
			.integer('wardrobe_item_category_group_id')
			.references('id')
			.inTable('wardrobe_item_category_groups')
			.notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
