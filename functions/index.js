const functions = require('firebase-functions');
const admin = require('firebase-admin');

let adminConfig;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  adminConfig = { credential: admin.credential.cert(serviceAccount) };
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  adminConfig = { credential: admin.credential.applicationDefault() };
} else {
  adminConfig = {};
}

admin.initializeApp(adminConfig);
const db = admin.firestore();
module.exports.db = db;

const app = require('./app');

exports.api = functions.region('us-central1').https.onRequest(app);

if (!process.env.FUNCTIONS_EMULATOR && !process.env.K_SERVICE) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
