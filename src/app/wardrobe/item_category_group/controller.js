import wardrobeItemCategoryRepository from '../item_category/repository.js';
import wardrobeItemCategoryGroupRepository from './repository.js';

const wardrobeItemCategoryGroupController = {
	async getAll(request, reply) {
		const res = await wardrobeItemCategoryGroupRepository.findAll();
		return reply.success({ data: res });
	},

	async getById(request, reply) {
		const group = await wardrobeItemCategoryGroupRepository.findById(request.params.id);
		if (!group) {
			return reply.callNotFound();
		}

		const categories = await wardrobeItemCategoryRepository.findByGroupId(group.id);

		return reply.success({
			data: {
				...group,
				members: categories,
			},
		});
	},
};

export default wardrobeItemCategoryGroupController;
