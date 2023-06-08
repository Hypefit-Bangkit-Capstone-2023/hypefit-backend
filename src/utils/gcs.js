import { Storage } from '@google-cloud/storage';
import config from '../config.js';
import fs from 'fs';
import { fileTypeFromStream } from 'file-type';
import path from 'path';

const storage = new Storage({
	keyFilename: './cloud-storage-service-account.json',
});

const bucket = storage.bucket(config.gcsBucketName);

async function uploadFile(filePath) {
	const fileType = await fileTypeFromStream(fs.createReadStream(filePath));
	const fileName = path.basename(filePath);
	const file = bucket.file(fileName);
	const writeStream = file.createWriteStream({
		metadata: {
			contentType: fileType.mime,
		},
	});

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(writeStream)
			.on('error', reject)
			.on('finish', () => {
				resolve(getUrl(fileName));
			});
	});
}

function getUrl(fileName) {
	return `https://storage.googleapis.com/${config.gcsBucketName}/${fileName}`;
}

export default { uploadFile, getUrl };
