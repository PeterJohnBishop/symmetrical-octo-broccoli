const admin = require("firebase-admin");
// const serviceAccount = require('./symmetrical-octo-firebase-adminsdk-bzm7q-8308e3a31c.json');
require('dotenv').config(); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "symmetrical-octo",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-bzm7q%40symmetrical-octo.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    }), 
  });
}

const validateFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log("Authenticated User:", decodedToken); // Debug log
    next();
  } catch (error) {
    res.status(403).json({ error: "Unauthorized", details: error.message });
  }
};

module.exports = validateFirebaseToken;