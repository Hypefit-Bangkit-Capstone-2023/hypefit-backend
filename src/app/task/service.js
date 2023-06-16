import config from '../../config.js';
import recommendationRepository from '../recommendation/repository.js';
import taskRepository from './repository.js';
import axios from 'axios';

const mlApi = axios.create({
	baseURL: config.mlApiBaseUrl,
	timeout: 0,
});

const taskService = {
	async run() {
		const pendingTasks = await taskRepository.findAllPending();
		console.log('pending task count:', pendingTasks.length);

		await Promise.all(
			pendingTasks.map(async (task) => {
				await taskRepository.updateToStarted(task.id);
				console.log('task started:', task.id, task.data);

				try {
					const result = await mlApi.post('/recommendation', task.data);
					console.log('task finished:', task.id);

					await taskRepository.updateToCompleted(task.id, JSON.stringify(result.data));

					const recommendations = await recommendationRepository.findByUserId(task.user_id);

					await Promise.all(
						result.data.map(async (data) => {
							const exist = recommendations.find((recommendation) => {
								return (
									recommendation.image_keys[0] == data.image_keys[0] &&
									recommendation.image_keys[1] == data.image_keys[1] &&
									recommendation.image_keys[2] == data.image_keys[2]
								);
							});
							if (!exist) {
								await recommendationRepository.create({
									user_id: task.user_id,
									image_keys: JSON.stringify(data.image_keys),
									valid_matches: JSON.stringify(data.valid_matches),
									color_descriptions: JSON.stringify(data.color_descriptions),
									dominant_colors: JSON.stringify(data.dominant_colors),
								});
							}
						})
					);
				} catch (error) {
					console.error('task failed:', task.id, error);
					await taskRepository.updateToFailed(task.id);
				}
			})
		);
	},
};

export default taskService;
