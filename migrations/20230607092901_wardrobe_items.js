/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('wardrobe_items', (table) => {
		table.increments('id').primary();
		table.integer('user_id').index().references('id').inTable('users').notNullable();
		table.string('name').notNullable();
		table
			.integer('wardrobe_item_category_id')
			.references('id')
			.inTable('wardrobe_item_categories')
			.notNullable();
		table.string('image_key').notNullable();
		table.timestamp('created_at', { useTz: true }).notNullable();
		table.timestamp('deleted_at', { useTz: true });
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
