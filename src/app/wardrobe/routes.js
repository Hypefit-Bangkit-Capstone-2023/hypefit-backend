import authPreValidation from '../auth/preValidation.js';
import wardrobeItemController from './item/controller.js';
import wardrobeItemCategoryController from './item_category/controller.js';
import wardrobeItemCategoryGroupController from './item_category_group/controller.js';

/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
export default async function wardrobeRoutes(fastify, opts) {
	fastify.post(
		'/v1/wardrobe/items',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.create
	);

	fastify.get(
		'/v1/wardrobe/items',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.getAll
	);

	fastify.get(
		'/v1/wardrobe/items/:id',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.getById
	);

	fastify.put(
		'/v1/wardrobe/items/:id',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.update
	);

	fastify.delete(
		'/v1/wardrobe/items/:id',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.delete
	);

	fastify.get(
		'/v1/wardrobe/item_category_groups',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemCategoryGroupController.getAll
	);

	fastify.get(
		'/v1/wardrobe/item_category_groups/:id',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemCategoryGroupController.getById
	);

	fastify.get(
		'/v1/wardrobe/item_categories',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemCategoryController.getAll
	);
}
