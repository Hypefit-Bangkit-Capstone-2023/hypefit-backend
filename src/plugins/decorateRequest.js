/** @type {import('fastify/types/plugin.js').FastifyPluginAsync} */
async function decorateRequest(fastify) {
	/**
	 * Decorate request with a 'user' property
	 * will be used to store user data if user is authenticated
	 */
	fastify.decorateRequest('user', null);
}

export default decorateRequest;
