const admin = require("firebase-admin");
const serviceAccount = require('./symmetrical-octo-firebase-adminsdk-bzm7q-8308e3a31c.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "symmetrical-octo",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY,
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
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const idToken = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken);
    req.user = decodedToken; // Attach the user info to the request object
    next(); 
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = validateFirebaseToken;