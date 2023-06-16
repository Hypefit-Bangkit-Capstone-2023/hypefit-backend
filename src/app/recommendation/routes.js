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

	fastify.get(
		'/v1/recommendations',
		{
			preValidation: authPreValidation,
		},
		recommendationController.getRecommendation
	);

	fastify.get(
		'/v1/recommendations/likes',
		{
			preValidation: authPreValidation,
		},
		recommendationController.getLikes
	);

	fastify.post(
		'/v1/recommendations/:id/like',
		{
			preValidation: authPreValidation,
		},
		recommendationController.like
	);

	fastify.delete(
		'/v1/recommendations/:id/like',
		{
			preValidation: authPreValidation,
		},
		recommendationController.removeLike
	);
}
