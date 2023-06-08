import firebaseAdmin from '../../utils/firebaseAdmin.js';
import wardrobeItemRepository from '../wardrobe/item/repository.js';

const userController = {
	async getProfileByUserId(request, reply) {
		const user = await firebaseAdmin.auth().getUser(request.user.firebase_user_id);
		const wardrobeItemCount = await wardrobeItemRepository.countByUserId(request.user.id);

		return reply.success({
			data: {
				name: user.displayName,
				photo_url: user.photoURL,
				liked_outfit_count: parseInt(Math.random() * 20), // TODO: replace with real data
				wardrobe_item_count: parseInt(wardrobeItemCount),
			},
		});
	},
};

export default userController;
