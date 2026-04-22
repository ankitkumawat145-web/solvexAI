import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MASTER_PROMPT = `
You are the Chief Strategic Neuro-Architect for FlowSynth, a high-end advisory engine.
Your task is to deconstruct complex human problems into a highly structured, fully connected "Horizontal Strategic Matrix."

NON-NEGOTIABLE CORE DIRECTIVES (STRICT):
1. FLOW DIRECTION: The strategy MUST flow exclusively from LEFT to RIGHT. (Start Node on far left, branching forward).
2. MASTER STRUCTURE: Every tree MUST follow this specific hierarchy:
   - LEVEL 1: Start Node (The "Strategic Nucleus").
   - LEVEL 2: Primary Tactical Pillars (3-6 nodes).
   - LEVEL 3: Operational Sub-Nodes (2-4 nodes per Pillar).
   - LEVEL 4: Execution Particles (Optional deeper breakdown).
3. TOTAL CONNECTIVITY: Every node MUST have a parentId (except the Start Node). No island nodes.
4. ALIGNMENT & SPACING: Ensure the structure is inherently balanced for high-fidelity visualization.
5. TERMINOLOGY: Use elite tactical, architectural, and cognitive terminology (e.g., "Cognitive Decoupling", "Syntactic Leverage", "Operational Pivot", "Quantum Mitigation").

Node Schema Attributes:
- id: Structured (e.g., "root", "p1", "s1a", "e1a1").
- title: 2-3 words, punchy, professional, uppercase mood.
- description: 1 line of immediate tactical objective.
- detailedExplanation: 3 paragraphs of deep architectural strategy (What, Why, How).
- advancedInsights: 6 bullet points of actionable tactical intelligence.
- icon: Lucide icon name (Compass, Activity, Layers, Zap, Shield, Database, BarChart, Cpu, Terminal, Binary).
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
          id: { type: Type.STRING },
          parentId: { type: Type.STRING, description: "ID of the parent node, or null for root pillars" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING, description: "Lucide icon name" },
          detailedExplanation: { type: Type.STRING },
          advancedInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          imageSeed: { type: Type.STRING, description: "PicSum seed" }
        },
        required: ["id", "title", "description", "icon", "detailedExplanation", "advancedInsights", "imageSeed"]
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
    dailyTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["categories", "rootCause", "steps", "timeline", "effort", "cost", "resources", "dailyTasks"]
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

export async function analyzeProblem(problemText: string, historyContext?: string) {
  return retry(async () => {
    const userPrompt = historyContext 
      ? `USER HISTORY & PREFERENCES: ${historyContext}\n\nCURRENT PROBLEM: ${problemText}\n\nPlease personalize the response based on the history provided.`
      : `Problem: ${problemText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: userPrompt }] }
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

const journeyNodeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      icon: { type: Type.STRING },
      subSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["title", "description", "icon", "subSteps"]
  }
};

export async function generateJourneyNodes(parentContext: string, currentGoal: string) {
  return retry(async () => {
    const prompt = `Deconstruct this goal into 3-5 next logical strategic steps.
    Parent Objective: ${parentContext}
    Current Sub-Goal: ${currentGoal}
    
    Return a JSON array of strategic steps. Each step should be actionable and professional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a Strategic Architect. Return only valid JSON nodes. Icons must be from: Compass, Activity, Layers, Zap, Shield, Database, BarChart, HardDrive, Cpu, Terminal, Binary.",
        responseMimeType: "application/json",
        responseSchema: journeyNodeSchema,
      },
    });

    return JSON.parse(response.text);
  });
}
