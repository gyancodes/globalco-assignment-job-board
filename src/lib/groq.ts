import Groq from "groq-sdk";

let groqInstance: Groq | null = null;

export function getGroq(): Groq {
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqInstance;
}
