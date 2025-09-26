import { type User, type InsertUser, type Image, type InsertImage, type SavedImage, type InsertSavedImage } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Image operations
  createImage(image: InsertImage): Promise<Image>;
  getImages(limit?: number, offset?: number): Promise<Image[]>;
  getImageById(id: string): Promise<Image | undefined>;
  
  // Saved image operations
  createSavedImage(savedImage: InsertSavedImage): Promise<SavedImage>;
  getSavedImagesByUserId(userId: string, limit?: number, offset?: number): Promise<SavedImage[]>;
  getSavedImageById(id: string): Promise<SavedImage | undefined>;
  deleteSavedImage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private images: Map<string, Image>;
  private savedImages: Map<string, SavedImage>;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.savedImages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const id = randomUUID();
    const image: Image = { 
      ...insertImage, 
      id,
      negativePrompt: insertImage.negativePrompt || null,
      userDisplayName: insertImage.userDisplayName || null,
      createdAt: new Date(),
      moderationStatus: 'approved', // Auto-approve for now
      likeCount: 0
    };
    this.images.set(id, image);
    return image;
  }

  async getImages(limit: number = 20, offset: number = 0): Promise<Image[]> {
    const allImages = Array.from(this.images.values())
      .filter(img => img.moderationStatus === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // newest first
    
    return allImages.slice(offset, offset + limit);
  }

  async getImageById(id: string): Promise<Image | undefined> {
    return this.images.get(id);
  }

  async createSavedImage(insertSavedImage: InsertSavedImage): Promise<SavedImage> {
    const id = randomUUID();
    const savedImage: SavedImage = {
      ...insertSavedImage,
      id,
      negativePrompt: insertSavedImage.negativePrompt || null,
      originalImageId: insertSavedImage.originalImageId || null,
      createdAt: new Date(),
    };
    this.savedImages.set(id, savedImage);
    return savedImage;
  }

  async getSavedImagesByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<SavedImage[]> {
    const userSavedImages = Array.from(this.savedImages.values())
      .filter(img => img.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // newest first
    
    return userSavedImages.slice(offset, offset + limit);
  }

  async getSavedImageById(id: string): Promise<SavedImage | undefined> {
    return this.savedImages.get(id);
  }

  async deleteSavedImage(id: string): Promise<boolean> {
    return this.savedImages.delete(id);
  }
}

export const storage = new MemStorage();
