import wardrobeItemRepository from './repository.js';
import yup from 'yup';
import fs from 'fs';
import config from '../../../config.js';
import { badRequestError } from '../../../utils/ApiError.js';
import wardrobeItemCategoryRepository from '../category/repository.js';
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
};

export default wardrobeItemController;
