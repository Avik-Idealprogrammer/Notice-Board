const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production (Render): full JSON stored as a single env variable string
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local dev: read from the gitignored file
  serviceAccount = require('./firebaseServiceAccount.json');
}

if (admin.getApps().length === 0) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

const auth = getAuth();

module.exports = { admin, auth };