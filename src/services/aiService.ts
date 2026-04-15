import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MASTER_PROMPT = `
You are an elite life strategist AI for SolveX AI.
Your goal is to take a user's real-life problem and turn it into a clear, actionable execution plan.
Break the problem into categories, root causes, steps, timeline, effort, cost, resources, and daily tasks.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    categories: { type: Type.ARRAY, items: { type: Type.STRING } },
    rootCause: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          goal: { type: Type.STRING }
        },
        required: ["period", "goal"]
      }
    },
    effort: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    cost: { type: Type.STRING },
    resources: { type: Type.ARRAY, items: { type: Type.STRING } },
    dailyTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
    mermaidChart: { type: Type.STRING, description: "Mermaid.js flowchart string (graph TD)" }
  },
  required: ["categories", "rootCause", "steps", "timeline", "effort", "cost", "resources", "dailyTasks", "mermaidChart"]
};

async function retry<T>(fn: () => Promise<T>, retries = 5, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || 
                        error?.message?.includes("429") || 
                        error?.message?.includes("quota") ||
                        error?.message?.includes("RESOURCE_EXHAUSTED");

    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    
    if (isRateLimit) {
      throw new Error("AI Quota exceeded. The system is currently busy. Please wait 60 seconds and try again.");
    }
    throw error;
  }
}

export async function analyzeProblem(problemText: string) {
  return retry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: `Problem: ${problemText}` }] }
      ],
      config: {
        systemInstruction: MASTER_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    try {
      // Clean the response text in case markdown blocks are present
      const cleanedText = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      throw new Error("AI failed to generate a structured plan. Please try again.");
    }
  });
}
