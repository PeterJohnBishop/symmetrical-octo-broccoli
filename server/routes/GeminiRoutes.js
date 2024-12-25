const router = require("express").Router();
const validateFirebaseToken = require('../utils/validate.js');
const { gemini15Flash, googleAI } = require('@genkit-ai/googleai');
const { genkit } = require('genkit');
const axios = require('axios');

// Configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Set default model
});

const helloFlow = ai.defineFlow('helloFlow', (name) => {
  return ai.generate(`Hello Gemini, my name is ${name}`);
});

router.post("/test", async (req, res) => {
  const data = { name: req.body.name };

  // Validate input
  if (!data.name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  try {
    const response = await helloFlow(data.name);
    console.log(response);
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error("Error in helloFlow:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;

// example with response schema

// const MenuItemSchema = z.object({
//   dishname: z.string(),
//   description: z.string(),
// });

// export const menuSuggestionFlowWithSchema = ai.defineFlow(
//   {
//     name: 'menuSuggestionFlow',
//     inputSchema: z.string(),
//     outputSchema: MenuItemSchema,
//   },
//   async (restaurantTheme) => {
//     const { output } = await ai.generate({
//       model: gemini15Flash,
//       prompt: `Invent a menu item for a ${restaurantTheme} themed restaurant.`,
//       output: { schema: MenuItemSchema },
//     });
//     if (output == null) {
//       throw new Error("Response doesn't satisfy schema.");
//     }
//     return output;
//   }
// );