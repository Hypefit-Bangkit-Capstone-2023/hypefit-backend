import wardrobeItemRepository from './repository.js';
import yup from 'yup';
import fs from 'fs';
import config from '../../../config.js';
import { badRequestError, notFoundError } from '../../../utils/ApiError.js';
import wardrobeItemCategoryRepository from '../item_category/repository.js';
import gcs from '../../../utils/gcs.js';

const wardrobeItemController = {
	async create(request, reply) {
		const { name, category_id, image_key } = await yup
			.object({
				name: yup.string().required(),
				category_id: yup.number().required(),
				image_key: yup.string().required(),
			})
			.validate(request.body);

		const category = await wardrobeItemCategoryRepository.findById(category_id);
		if (!category) {
			throw badRequestError({ message: 'Invalid category_id' });
		}

		const imageFilePath = `${config.uploadTmpDir}/${image_key}`;
		if (!fs.existsSync(imageFilePath)) {
			throw badRequestError({ message: 'Invalid image key' });
		}

		await gcs.uploadFile(imageFilePath);
		await fs.promises.rm(imageFilePath);

		await wardrobeItemRepository.create({
			user_id: request.user.id,
			name,
			wardrobe_item_category_id: category_id,
			image_key,
		});

		return reply.success();
	},

	async getAll(request, reply) {
		const res = await wardrobeItemRepository.findByUserId(
			request.user.id,
			{
				category_id: request.query.category_id,
			},
			true
		);

		for (const item of res) {
			item.image_url = gcs.getUrl(item.image_key);
			delete item.image_key;
		}

		return reply.success({ data: res });
	},

	async getById(request, reply) {
		const item = await wardrobeItemRepository.findByIdAndUserId(request.params.id, request.user.id);

		if (!item) {
			reply.callNotFound();
		}

		item.image_url = gcs.getUrl(item.image_key);
		delete item.image_key;

		return reply.success({ data: item });
	},

	async update(request, reply) {
		const { name, category_id, image_key } = await yup
			.object({
				name: yup.string().required(),
				category_id: yup.number().required(),
				image_key: yup.string().required(),
			})
			.validate(request.body);

		const item = await wardrobeItemRepository.findForUpdateOrDelete(
			request.params.id,
			request.user.id
		);

		if (!item) {
			throw notFoundError({ message: 'Item not found' });
		}

		if (item.category_id != category_id) {
			const category = await wardrobeItemCategoryRepository.findById(category_id);
			if (!category) {
				throw badRequestError({ message: 'Invalid category_id' });
			}
		}

		if (item.image_key != image_key) {
			const imageFilePath = `${config.uploadTmpDir}/${image_key}`;
			if (!fs.existsSync(imageFilePath)) {
				throw badRequestError({ message: 'Invalid image key' });
			}

			await gcs.uploadFile(imageFilePath);
			await fs.promises.rm(imageFilePath);
		}

		await wardrobeItemRepository.update({
			id: item.id,
			name,
			wardrobe_item_category_id: category_id,
			image_key,
		});

		return reply.success();
	},

	async delete(request, reply) {
		const item = await wardrobeItemRepository.findForUpdateOrDelete(
			request.params.id,
			request.user.id
		);

		if (!item) {
			throw notFoundError({ message: 'Item not found' });
		}

		await wardrobeItemRepository.delete(item.id);

		return reply.success();
	},
};

export default wardrobeItemController;
