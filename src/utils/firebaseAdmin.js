import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { createRequire } from 'module';

const serviceAccount = createRequire(import.meta.url)('../../firebase-service-account.json');

initializeApp({ credential: admin.credential.cert(serviceAccount) });

export default admin;
