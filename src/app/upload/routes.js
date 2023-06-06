import FastifyFormidable from 'fastify-formidable';
import authPreValidation from '../auth/preValidation.js';
import uploadController from './controller.js';

/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
export default async function uploadRoutes(fastify, opts) {
	fastify.register(FastifyFormidable, {
		removeFilesFromBody: true,
	});

	fastify.post(
		'/upload/image',
		{
			preValidation: authPreValidation,
		},
		uploadController.image
	);
}
