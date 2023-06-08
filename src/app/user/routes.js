import authPreValidation from '../auth/preValidation.js';
import userController from './controller.js';

/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
export default async function userRoutes(fastify, opts) {
	fastify.get(
		'/v1/users/me',
		{
			preValidation: authPreValidation,
		},
		userController.getProfileByUserId
	);
}
