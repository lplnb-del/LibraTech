import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBookInsight = async (title: string, author: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `请为${author}写的书《${title}》写一个简短精彩的摘要（最多2句话）。关注类型和主要主题。`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "暂无摘要。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 洞察暂时不可用。";
  }
};