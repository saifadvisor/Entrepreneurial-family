
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { VideoMetadata, FormatType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ExtractedMetadataResponse {
  metadata: VideoMetadata;
  sources: { web?: { uri: string; title: string } }[];
}

export const extractVideoMetadata = async (url: string): Promise<ExtractedMetadataResponse> => {
  // Use gemini-3-flash-preview with googleSearch tool for real-time metadata retrieval
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Retrieve the actual title, thumbnail image URL, and duration for this video URL: ${url}.
    If it is a YouTube or Facebook video, find the correct details. 
    Return the response in JSON format following the schema. 
    Provide several realistic simulated download formats (4K, 1080p, 720p, MP3) with estimated file sizes.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          thumbnail: { type: Type.STRING },
          duration: { type: Type.STRING },
          platform: { type: Type.STRING },
          formats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                quality: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['video', 'audio'] },
                size: { type: Type.STRING },
                extension: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ['quality', 'type', 'size', 'extension', 'url']
            }
          }
        },
        required: ['title', 'thumbnail', 'duration', 'platform', 'formats']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to extract metadata");
  
  const metadata = JSON.parse(text) as VideoMetadata;
  const sources = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { metadata, sources };
};
