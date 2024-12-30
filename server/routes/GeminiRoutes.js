const router = require("express").Router();
const validateFirebaseToken = require('../utils/validate.js');
const { gemini15Flash, googleAI } = require('@genkit-ai/googleai');
const { genkit } = require('genkit');
const { z } = require("zod");
const admin = require('firebase-admin');

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Set default model
});

const responsSchema = z.object({
  reply: z.string(),
});

const askBasicFlow = ai.defineFlow(
  {
    name: 'askBasicFLow',
    inputSchema: z.string(),
    outputSchema: responsSchema
  },
  async (input) => {
    const { output } = await ai.generate({
      model: gemini15Flash,
      prompt: input,
      output: {
        schema: responsSchema,
      }
    });
    console.log("Generated Output:", output);
    if (output == null) {
      throw new Error("Response doesn't satisfy schema.");
    }
    return output;
  }
);

router.post("/askBasic", validateFirebaseToken, async (req, res) => {

  const input = req.body.input;

  try {
    const response = await askBasicFlow(input);
    res.status(200).json(response);
  }
  catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error: error.message });
  }

});

router.post("/transcript/add", validateFirebaseToken, async (req, res) => {
  const { query, user, timestamp, reply } = req.body
  const db = admin.firestore();

  db.collection("transcripts").add({
    query: query,
    user: user,
    timestamp: timestamp,
    reply: reply
  })
  .then((docRef) => {
      res.status(200).json({ message: "Saved", id: docRef.id });
  })
  .catch((error) => {
    console.error("Firestore Error:", error);
      res.status(400).json({ code: error.code, error: error.message });
  });

});

router.post("/transcript/get", validateFirebaseToken, async (req, res) => {
  const db = admin.firestore();

  db.collection("transcripts")
  .get()
  .then((querySnapshot) => {
    // Map through querySnapshot to construct the data array
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Include the document data
    }));

    // Send the data array in the response
    res.status(200).json(data);
  })
  .catch((error) => {
    // Handle and return the error
    res.status(400).json({ code: error.code, error: error.message });
  });
});

router.post("/transcript/delete/:docId", validateFirebaseToken, async (req, res) => {
  const { docId } = req.params;
  const db = admin.firestore();
  
  db.collection("transcripts").doc(docId).delete()
  .then(() => {
    res.status(200).json({ message: "Document successfully deleted!" });
  })
  .catch((error) => {
    res.status(400).json({ code: error.code, error: error.message });
  });
});

module.exports = router;


