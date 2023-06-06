import { unauthorizedError } from '../../utils/ApiError.js';
import firebaseAdmin from '../../utils/firebaseAdmin.js';

/** @type {import('fastify/types/hooks.js').preValidationAsyncHookHandler} */
export default async function authPreValidation(request) {
	const accessToken = request.headers.authorization?.split('Bearer ').pop();
	if (!accessToken) {
		throw unauthorizedError({
			message: 'Access token on Authorization header is required.',
		});
	}

	try {
		await firebaseAdmin.auth().verifyIdToken(accessToken);
	} catch (error) {
		this.log.error(`${error.name}: ${error.message}`);
		throw unauthorizedError({
			message: 'Invalid access token.',
		});
	}
}
