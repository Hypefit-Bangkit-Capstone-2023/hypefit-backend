import wardrobeItemCategoryGroupRepository from './repository.js';

const wardrobeItemCategoryGroupController = {
	async getAll(request, reply) {
		const res = await wardrobeItemCategoryGroupRepository.findAll();
		return reply.success({ data: res });
	},
};

export default wardrobeItemCategoryGroupController;
