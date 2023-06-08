import authPreValidation from '../auth/preValidation.js';
import wardrobeItemController from './item/controller.js';

/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
export default async function wardrobeRoutes(fastify, opts) {
	fastify.post(
		'/v1/wardrobe/items',
		{
			preValidation: authPreValidation,
		},
		wardrobeItemController.create
	);
}
