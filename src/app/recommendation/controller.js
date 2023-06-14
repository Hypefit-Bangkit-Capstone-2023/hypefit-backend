import { unprocessableError } from '../../utils/ApiError.js';
import taskRepository, { TaskStatus } from '../task/repository.js';
import wardrobeItemRepository from '../wardrobe/item/repository.js';
import recommendationRepository from './repository.js';
import gcs from '../../utils/gcs.js';

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

	async getRecommendation(request, reply) {
		let pending_task_count = 0;
		let started_task_count = 0;
		let completed_task_count = 0;
		let failed_task_count = 0;

		const [statusCount, recommendations] = await Promise.all([
			taskRepository.countStatusByUserId(request.user.id),
			recommendationRepository.findByUserId(request.user.id),
		]);

		for (const row of statusCount) {
			row.count = parseInt(row.count);
			if (row.status == TaskStatus.PENDING) {
				pending_task_count = row.count;
			} else if (row.status == TaskStatus.STARTED) {
				started_task_count = row.count;
			} else if (row.status == TaskStatus.COMPLETED) {
				completed_task_count = row.count;
			} else if (row.status == TaskStatus.FAILED) {
				failed_task_count = row.count;
			}
		}

		const items = recommendations.map((recommendation) => {
			const image_urls = recommendation.image_keys.map((image_key) => {
				return gcs.getUrl(image_key);
			});

			delete recommendation.image_keys;

			const is_liked = recommendation.liked_at != null;

			return {
				id: recommendation.id,
				image_urls,
				is_liked,
			};
		});

		return reply.success({
			data: {
				pending_task_count,
				started_task_count,
				completed_task_count,
				failed_task_count,
				items,
			},
		});
	},
};

export default recommendationController;
