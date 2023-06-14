import { unprocessableError } from '../../utils/ApiError.js';
import taskRepository from '../task/repository.js';
import wardrobeItemRepository from '../wardrobe/item/repository.js';

const recommendationController = {
	async createTask(request, reply) {
		const user_id = request.user.id;

		const isPendingOrStartedTask = await taskRepository.isPendingOrStartedByUserId(user_id);
		if (isPendingOrStartedTask) {
			throw unprocessableError({
				message: 'There is already a pending or started task',
			});
		}

		const top_keys = [];
		const bottom_keys = [];
		const shoe_keys = [];

		const items = await wardrobeItemRepository.findByUserId(user_id);
		for (const item of items) {
			if (item.category_group_name.toLowerCase() == 'top') {
				top_keys.push(item.image_key);
			} else if (item.category_group_name.toLowerCase() == 'bottom') {
				bottom_keys.push(item.image_key);
			} else if (item.category_group_name.toLowerCase() == 'shoe') {
				shoe_keys.push(item.image_key);
			}
		}

		await taskRepository.create({
			user_id,
			data: {
				top_keys,
				bottom_keys,
				shoe_keys,
			},
		});

		return reply.success();
	},
};

export default recommendationController;
