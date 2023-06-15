import wardrobeItemCategoryRepository from './repository.js';

const wardrobeItemCategoryController = {
	async getAll(request, reply) {
		const res = await wardrobeItemCategoryRepository.findAll();
		return reply.success({ data: res });
	},
};

export default wardrobeItemCategoryController;
