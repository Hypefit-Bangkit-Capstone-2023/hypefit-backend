import firebaseAdmin from '../../utils/firebaseAdmin.js';
import recommendationRepository from '../recommendation/repository.js';
import wardrobeItemRepository from '../wardrobe/item/repository.js';

const userController = {
	async getProfileByUserId(request, reply) {
		const [user, wardrobeItemCount, likedOutfitCount] = await Promise.all([
			firebaseAdmin.auth().getUser(request.user.firebase_user_id),
			wardrobeItemRepository.countByUserId(request.user.id),
			recommendationRepository.countLikedByUserId(request.user.id),
		]);

		return reply.success({
			data: {
				name: user.displayName,
				photo_url: user.photoURL,
				liked_outfit_count: parseInt(likedOutfitCount),
				wardrobe_item_count: parseInt(wardrobeItemCount),
			},
		});
	},
};

export default userController;
