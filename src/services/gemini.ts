import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-2.5-flash-image";

export const TEXT_MODEL = "gemini-3-flash-preview";

export async function suggestPrompt(keywords: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: {
      parts: [
        {
          text: `You are a creative director for a Norse-themed book series. 
          The user has provided these keywords: "${keywords}". 
          Generate a highly descriptive, atmospheric, and cinematic image prompt for a book cover based on these keywords. 
          Keep it focused on visual details, lighting, and mood. 
          Do not include the title or subtitle in the prompt itself, as they are handled separately.
          Return ONLY the prompt text.`,
        },
      ],
    },
  });

  return response.text?.trim() || "A mystical Norse landscape with ethereal lighting.";
}

export async function generateImage(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error("No candidates returned from the model.");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      throw new Error(`Generation failed with reason: ${candidate.finishReason}`);
    }

    let textFeedback = "";
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        textFeedback += part.text + " ";
      }
    }

    throw new Error(textFeedback.trim() || "The model did not provide an image in the response.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "An unexpected error occurred during image generation.");
  }
}

export async function editImage(base64Image: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const data = base64Image.split(",")[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data,
              mimeType: "image/png",
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error("No candidates returned from the model.");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      throw new Error(`Edit failed with reason: ${candidate.finishReason}`);
    }

    let textFeedback = "";
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        textFeedback += part.text + " ";
      }
    }

    throw new Error(textFeedback.trim() || "The model did not provide an edited image in the response.");
  } catch (error: any) {
    console.error("Gemini Image Edit Error:", error);
    throw new Error(error.message || "An unexpected error occurred during image editing.");
  }
}
