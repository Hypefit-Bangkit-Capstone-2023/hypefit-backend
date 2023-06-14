import authPreValidation from '../auth/preValidation.js';
import recommendationController from './controller.js';

/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
export default async function recommendationRoutes(fastify, opts) {
	fastify.post(
		'/v1/recommendations',
		{
			preValidation: authPreValidation,
		},
		recommendationController.createTask
	);
}
