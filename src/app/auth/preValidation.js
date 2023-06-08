import { unauthorizedError } from '../../utils/ApiError.js';
import firebaseAdmin from '../../utils/firebaseAdmin.js';
import userRepository from '../user/repository.js';

/** @type {import('fastify/types/hooks.js').preValidationAsyncHookHandler} */
export default async function authPreValidation(request) {
	const accessToken = request.headers.authorization?.split('Bearer ').pop();
	if (!accessToken) {
		throw unauthorizedError({
			message: 'Access token on Authorization header is required.',
		});
	}

	let uid;
	try {
		const decoded = await firebaseAdmin.auth().verifyIdToken(accessToken);
		uid = decoded.uid;
	} catch (error) {
		this.log.error(`${error.name}: ${error.message}`);
		throw unauthorizedError({
			message: 'Invalid access token.',
		});
	}

	let user = await userRepository.findByFirebaseUserId(uid);
	if (!user) {
		user = await userRepository.create({ firebase_user_id: uid });
	}

	if (!user?.id) {
		throw unauthorizedError({
			message: 'Unexpected authorization error',
		});
	}

	request.user = {
		id: user.id,
		firebase_user_id: uid,
	};
}
