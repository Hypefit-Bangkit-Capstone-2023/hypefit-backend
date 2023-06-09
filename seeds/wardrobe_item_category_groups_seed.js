/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const seed = async (knex) => {
	const data = await knex('wardrobe_item_category_groups').select('*');

	let topExist = false;
	let bottomExist = false;
	let shoeExist = false;

	data.forEach((row) => {
		if (row.name === 'Top') {
			topExist = true;
		}
		if (row.name === 'Bottom') {
			bottomExist = true;
		}
		if (row.name === 'Shoe') {
			shoeExist = true;
		}
	});

	if (!topExist || !bottomExist || !shoeExist) {
		await knex('wardrobe_item_category_groups').insert([
			{ name: 'Top' },
			{ name: 'Bottom' },
			{ name: 'Shoe' },
		]);
	}
};
