import firebaseAdmin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { createRequire } from 'module';

const serviceAccount = createRequire(import.meta.url)('../../firebase-service-account.json');

initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });

export default firebaseAdmin;
