const admin = require("firebase-admin");
const serviceAccount = require('./symmetrical-octo-firebase-adminsdk-bzm7q-8308e3a31c.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), 
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