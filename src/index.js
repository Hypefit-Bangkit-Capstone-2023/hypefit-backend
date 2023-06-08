import Fastify from 'fastify';
import fastifyEtag from '@fastify/etag';
import config from './config.js';
import customErrorHandler from './utils/customErrorHandler.js';
import customNotFoundHandler from './utils/customNotFoundHandler.js';
import { defaultLogger } from './utils/logger.js';
import fastifyCors from '@fastify/cors';
import decorateRequest from './plugins/decorateRequest.js';
import decorateReply from './plugins/decorateReply.js';
import uploadRoutes from './app/upload/routes.js';
import fs from 'fs';
import wardrobeRoutes from './app/wardrobe/routes.js';
import userRoutes from './app/user/routes.js';

// init upload tmp dir
if (!fs.existsSync(config.uploadTmpDir)) {
	await fs.promises.mkdir(config.uploadTmpDir, { recursive: true });
}

const fastify = Fastify({ logger: defaultLogger, trustProxy: true });

fastify.setErrorHandler(customErrorHandler);
fastify.setNotFoundHandler(customNotFoundHandler);

fastify.register(decorateRequest);
fastify.register(decorateReply);
fastify.register(fastifyEtag);
fastify.register(fastifyCors, {
	origin: config.corsAllowedOrigin,
});

fastify.register(uploadRoutes);
fastify.register(wardrobeRoutes);
fastify.register(userRoutes);

await fastify.listen({
	port: config.port,
	host: config.host,
});
