import { config } from "../config/gemini";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generate(query, systemPrompt) {
    const interaction = await ai.interactions.create({
        model: config.model,
        input: query,
        system_instruction: systemPrompt ?? '',
        generation_config: {
            thinking_level: "low",
        }
    });
    return interaction.output_text
}