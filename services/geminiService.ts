import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getMathFact = async (number: number, difficulty: Difficulty): Promise<string> => {
  if (!ai) {
    console.warn("API_KEY not found, skipping AI generation.");
    return "";
  }

  const prompt = difficulty === Difficulty.HARD
    ? `Generate a fun, slightly complex 1-sentence math fact (involving multiplication, factors, or interesting properties) suitable for a 10-year-old regarding the number ${number}. Keep it under 15 words.`
    : `Generate a very short, simple, 1-sentence math fact or encouraging counting message suitable for a 5-year-old who just landed on the number ${number} in a board game. Keep it under 15 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
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
