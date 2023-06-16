import firebaseAdmin from '../../utils/firebaseAdmin.js';
import recommendationRepository from '../recommendation/repository.js';
import taskRepository from '../task/repository.js';
import wardrobeItemRepository from '../wardrobe/item/repository.js';

const userController = {
	async getProfileByUserId(request, reply) {
		const [user, wardrobeItemCount, likedOutfitCount, statusCount] = await Promise.all([
			firebaseAdmin.auth().getUser(request.user.firebase_user_id),
			wardrobeItemRepository.countByUserId(request.user.id),
			recommendationRepository.countLikedByUserId(request.user.id),
			taskRepository.countStatusByUserId(request.user.id),
		]);

		const task_count = {
			pending: 0,
			started: 0,
			completed: 0,
			failed: 0,
		};

		for (const row of statusCount) {
			const key = row.status.toLowerCase();
			task_count[key] = parseInt(row.count);
		}

		return reply.success({
			data: {
				name: user.displayName,
				photo_url: user.photoURL,
				liked_outfit_count: parseInt(likedOutfitCount),
				wardrobe_item_count: parseInt(wardrobeItemCount),
				task_count,
			},
		});
	},
};

export default userController;
