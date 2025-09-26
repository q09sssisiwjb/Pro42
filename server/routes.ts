import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
import { insertImageSchema, insertSavedImageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Initialize Gemini AI with the provided API key from environment
  const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!googleApiKey) {
    console.warn("Warning: No Google API key found in environment variables. AI features will be disabled.");
  }
  
  const ai = googleApiKey ? new GoogleGenAI({ apiKey: googleApiKey }) : null;

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Prompt enhancement endpoint
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Prompt is required and must be a string" });
      }

      if (!ai) {
        return res.status(503).json({ 
          error: "AI service unavailable", 
          details: "Google API key not configured" 
        });
      }

      const enhancementPrompt = `You are an expert AI image prompt engineer. Your task is to enhance and improve image generation prompts to make them more detailed, creative, and effective for AI image generation.

Given the basic prompt: "${prompt}"

Please enhance this prompt by:
1. Adding specific visual details (lighting, colors, composition)
2. Including artistic style information if appropriate
3. Adding technical photography/art terms that improve image quality
4. Maintaining the original intent while making it more descriptive
5. Keeping it concise but detailed (aim for 1-2 sentences)

Return only the enhanced prompt, nothing else.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: enhancementPrompt,
      });

      const enhancedPrompt = response.text?.trim() || prompt;

      res.json({ enhancedPrompt });
      
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Failed to enhance prompt", details: errorMessage });
    }
  });

  // Image endpoints
  app.post("/api/images", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validation = insertImageSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: errorMessage.toString()
        });
      }
      
      const { prompt, negativePrompt, model, width, height, imageData, artStyle, userDisplayName } = validation.data;
      
      const newImage = await storage.createImage({
        prompt: prompt.trim(),
        negativePrompt: negativePrompt?.trim() || null,
        model,
        width,
        height,
        imageData,
        artStyle,
        userDisplayName: userDisplayName || null
      });
      
      res.json(newImage);
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: "Failed to save image" });
    }
  });

  app.get("/api/images", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const images = await storage.getImages(limit, offset);
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.get("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const image = await storage.getImageById(id);
      
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      res.json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  // Saved images endpoints
  app.post("/api/saved-images", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validation = insertSavedImageSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: errorMessage.toString()
        });
      }
      
      const { userId, prompt, negativePrompt, model, width, height, imageData, artStyle, originalImageId } = validation.data;
      
      const savedImage = await storage.createSavedImage({
        userId,
        prompt: prompt.trim(),
        negativePrompt: negativePrompt?.trim() || null,
        model,
        width,
        height,
        imageData,
        artStyle,
        originalImageId: originalImageId || null
      });
      
      res.json(savedImage);
    } catch (error) {
      console.error('Error saving image to favorites:', error);
      res.status(500).json({ error: "Failed to save image to favorites" });
    }
  });

  app.get("/api/saved-images", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const savedImages = await storage.getSavedImagesByUserId(userId, limit, offset);
      res.json(savedImages);
    } catch (error) {
      console.error('Error fetching saved images:', error);
      res.status(500).json({ error: "Failed to fetch saved images" });
    }
  });

  app.delete("/api/saved-images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSavedImage(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Saved image not found" });
      }
      
      res.json({ success: true, message: "Image removed from favorites" });
    } catch (error) {
      console.error('Error deleting saved image:', error);
      res.status(500).json({ error: "Failed to remove image from favorites" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
