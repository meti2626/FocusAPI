import { GoogleGenAI, Type } from "@google/genai";
import { Video, Flashcard } from '../types';

// NOTE: In a production environment, this should be handled securely.
// Since we cannot ask the user for input in code, we rely on the environment variable.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Searches for educational videos and filters out non-educational content.
   */
  async searchEducationalVideos(query: string): Promise<Video[]> {
    if (!apiKey) return [];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find 8 high-quality, strictly educational YouTube videos about "${query}". 
        Do not include entertainment, reaction videos, or vlogs. 
        Focus on credible channels (e.g., CrashCourse, TED-Ed, MIT OpenCourseWare, 3Blue1Brown, etc.).
        Return a JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                youtubeId: { type: Type.STRING, description: "The 11-character YouTube video ID" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                channelTitle: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["youtubeId", "title", "description", "channelTitle", "difficulty", "tags"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      
      // Transform to our internal Video type
      return data.map((item: any, index: number) => ({
        id: `gen-${Date.now()}-${index}`,
        youtubeId: item.youtubeId,
        title: item.title,
        description: item.description,
        channelTitle: item.channelTitle,
        thumbnailUrl: `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`,
        tags: item.tags,
        difficulty: item.difficulty,
      }));
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return [];
    }
  },

  /**
   * Generates a summary for a video based on its title and description.
   */
  async generateSummary(videoTitle: string, videoDescription: string): Promise<string> {
    if (!apiKey) return "API Key missing.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a concise, bulleted learning summary for an educational video titled "${videoTitle}" with description: "${videoDescription}". Focus on key learning outcomes.`,
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Summary Generation Error:", error);
      return "Error generating summary.";
    }
  },

  /**
   * Generates flashcards for a specific topic/video.
   */
  async generateFlashcards(topic: string, videoId: string): Promise<Flashcard[]> {
    if (!apiKey) return [];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create 5 study flashcards for the topic: "${topic}". Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "The question or term" },
                back: { type: Type.STRING, description: "The answer or definition" }
              },
              required: ["front", "back"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      return data.map((card: any, index: number) => ({
        id: `fc-${Date.now()}-${index}`,
        videoId: videoId,
        front: card.front,
        back: card.back,
        status: 'new'
      }));
    } catch (error) {
      console.error("Flashcard Generation Error:", error);
      return [];
    }
  }
};