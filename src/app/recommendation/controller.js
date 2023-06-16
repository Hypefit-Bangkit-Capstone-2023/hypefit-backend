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
		if (!items.length) {
			throw unprocessableError({
				message: 'There is no wardrobe item',
			});
		}

		for (const item of items) {
			if (item.category_group_name.toLowerCase() == 'top') {
				top_keys.push(item.image_key);
			} else if (item.category_group_name.toLowerCase() == 'bottom') {
				bottom_keys.push(item.image_key);
			} else if (item.category_group_name.toLowerCase() == 'shoe') {
				shoe_keys.push(item.image_key);
			}
		}

		if (!top_keys.length || !bottom_keys.length || !shoe_keys.length) {
			throw unprocessableError({
				message: 'Please upload at least one top, bottom, and shoe',
			});
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

		const [statusCount, recommendations, countPerCategoryGroup] = await Promise.all([
			taskRepository.countStatusByUserId(request.user.id),
			recommendationRepository.findByUserId(request.user.id),
			wardrobeItemRepository.countPerCategoryGroupByUserId(request.user.id),
		]);

		const wardrobe_item_count = {
			top: 0,
			bottom: 0,
			shoe: 0,
		};

		for (const row of countPerCategoryGroup) {
			const key = row.category_group_name.toLowerCase();
			wardrobe_item_count[key] = parseInt(row.count);
		}

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
				wardrobe_item_count,
				pending_task_count,
				started_task_count,
				completed_task_count,
				failed_task_count,
				items,
			},
		});
	},

	async getLikes(request, reply) {
		const user_id = request.user.id;

		const recommendations = await recommendationRepository.findLikedByUserId(user_id);

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
			data: items,
		});
	},

	async like(request, reply) {
		const user_id = request.user.id;
		const id = request.params.id;

		const recommendation = await recommendationRepository.findByIdAndUserId(id, user_id);
		if (!recommendation) {
			throw unprocessableError({
				message: 'Recommendation not found',
			});
		}

		await recommendationRepository.updateLikedAtById(id, new Date());

		return reply.success();
	},

	async removeLike(request, reply) {
		const user_id = request.user.id;
		const id = request.params.id;

		const recommendation = await recommendationRepository.findByIdAndUserId(id, user_id);
		if (!recommendation) {
			throw unprocessableError({
				message: 'Recommendation not found',
			});
		}

		await recommendationRepository.updateLikedAtById(id, null);

		return reply.success();
	},
};

export default recommendationController;
