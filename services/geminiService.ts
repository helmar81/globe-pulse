import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "../constants";

// FIX: Use import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
// ... rest of your code

export const getCityInsight = async (city: string, time: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please set VITE_GEMINI_API_KEY in .env file.";
  }

  try {
    const prompt = `
      Current time in ${city} is ${time}. 
      In one short, witty sentence (under 30 words), describe the current vibe of the city right now. 
      Mention if people are sleeping, commuting, partying, or working.
    `;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const response = await model.generateContent(prompt);

    return response.response.text() || "Could not retrieve city insight.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connecting to global consciousness failed. Try again.";
  }
};
