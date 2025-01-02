const router = require("express").Router();
const validateFirebaseToken = require('../utils/validate.js');
const admin = require('firebase-admin');
const multer = require("multer");

const bucket = admin.storage().bucket();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null,Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

router.post("/upload-single", validateFirebaseToken, upload.single("image"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).send("No file uploaded.");
        }
  
        const file = bucket.file(`uploads/${Date.now()}_${req.file.originalname}`);
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
  
        stream.on("error", (error) => {
          console.error(error);
          res.status(500).send("Error uploading file.");
        });
  
        stream.on("finish", async () => {
          // Make the file public if needed
          await file.makePublic();
          res.status(200).send({ 
            message: "File uploaded successfully.",
            publicUrl: file.publicUrl(),
          });
        });
  
        stream.end(req.file.buffer);
      } catch (error) {
        console.error(error);
        res.status(500).send("Unexpected error occurred.");
      }
    }
  );

  router.post("/upload-multiple", validateFirebaseToken, upload.array("images", 6), async (req, res) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).send("No files uploaded.");
        }
  
        const uploadPromises = req.files.map(async (file) => {
          const firebaseFile = bucket.file(
            `uploads/${Date.now()}_${file.originalname}`
          );
          const stream = firebaseFile.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });
  
          return new Promise((resolve, reject) => {
            stream.on("error", reject);
            stream.on("finish", async () => {
              // Make the file public if needed
              await firebaseFile.makePublic();
              resolve(firebaseFile.publicUrl());
            });
            stream.end(file.buffer);
          });
        });
  
        const publicUrls = await Promise.all(uploadPromises);
        res.status(200).send({
          message: "Files uploaded successfully.",
          publicUrls,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Unexpected error occurred.");
      }
    }
  );
  
  module.exports = router;

