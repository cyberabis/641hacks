const admin = require('firebase-admin');
const serviceAccount = require('hacks-ba539-firebase-adminsdk-fvcvd-68b43104da.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}

module.exports = admin.firestore();