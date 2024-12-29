const router = require("express").Router();
const validateFirebaseToken = require('../utils/validate.js');
const { gemini15Flash, googleAI } = require('@genkit-ai/googleai');
const { genkit } = require('genkit');
const { z } = require("zod");
const axios = require("axios");
const { schema } = require("../../../literate-meme/server/models/PostModel.js");

// Configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Set default model
});

// Create a ClickUp Task | Start

const responseSchema = z.object({
  list: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  dueDate: z.string(),
  missing: z.array(z.string()),
});

const createTaskFLow = ai.defineFlow(
  {
    name: 'createTaskFLow',
    inputSchema: z.string(),
    outputSchema: responseSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: gemini15Flash,
      prompt: `Evaluate this input: ${input} and if it contains values list name, task name, task description, start date and/or due date, assign them to the corresponding variables in a JSON object. If any of the values are null, list the 
      missing values in the missing array`,
      output: {
        schema: responseSchema,
      },
    });
    if (output == null) {
      throw new Error("Response doesn't satisfy schema.");
    }
    return output;
  }
);

router.post("/clickupTask", async (req, res) => {

  const input = req.body.task;

  try {
    const response = await createTaskFLow(input);
    res.status(200).json(response);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }

});

// Create a ClickUp Task | End



module.exports = router;


