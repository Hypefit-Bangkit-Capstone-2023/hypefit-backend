import fs from 'fs';
import config from '../../config.js';
import yup from 'yup';
import { fileTypeFromStream } from 'file-type';
import ApiError, { badRequestError } from '../../utils/ApiError.js';
import bytes from 'bytes';
import sharp from 'sharp';

const uploadController = {
	async image(request, reply) {
		try {
			await request.parseMultipart({
				uploadDir: config.uploadTmpDir,
				maxFileSize: config.uploadImageFileSizeLimit,
				// prevent unused files fields from being parsed and stored to disk
				filter: function (params) {
					return params.name === 'file';
				},
			});
		} catch (error) {
			if (error.message.indexOf('options.maxFileSize') > -1) {
				const maxFileSize = bytes.format(config.uploadImageFileSizeLimit);
				throw new ApiError({
					httpCode: error.httpCode,
					message: `The file you're trying to upload exceeds the maximum allowed size of ${maxFileSize}`,
				});
			}
			throw error;
		}

		const { file } = await yup
			.object({
				file: yup.mixed().required(),
			})
			.validate(request.files);

		const fileType = await fileTypeFromStream(fs.createReadStream(file.filepath));
		if (!fileType || !['image/jpeg', 'image/png'].includes(fileType.mime)) {
			await fs.promises.rm(file.filepath);
			throw badRequestError({
				message: 'File format is invalid. Only jpeg and png are allowed',
			});
		}

		const fileBuffer = await fs.promises.readFile(file.filepath);
		const sharpImage = sharp(fileBuffer);
		const metadata = await sharpImage.metadata();

		const maxWidth = 2160;
		if (metadata.width > maxWidth) {
			sharpImage.resize(maxWidth);
		}

		if (metadata.format === 'png') {
			// set background to white
			sharpImage.flatten({ background: { r: 255, g: 255, b: 255 } });
		}

		const finalExt = 'jpg';

		await sharpImage.jpeg({ mozjpeg: true, quality: 70 }).toFile(`${file.filepath}.${finalExt}`);
		await fs.promises.rm(file.filepath);

		reply.success({ data: { key: `${file.newFilename}.${finalExt}` } });
	},
};

export default uploadController;
