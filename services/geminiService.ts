import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getMathFact = async (number: number): Promise<string> => {
  if (!ai) {
    console.warn("API_KEY not found, skipping AI generation.");
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a very short, fun, 1-sentence math fact or encouraging message for a child who just landed on the number ${number} in a board game. Keep it under 15 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Minimize latency
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating math fact:", error);
    return "";
  }
};
