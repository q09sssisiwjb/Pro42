import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Download, 
  RefreshCw,
  Languages,
  FileText,
  Settings,
  Copy,
  Image as ImageIcon,
  Loader2,
  Video,
  Zap,
  Save,
  Edit,
  X,
  Sparkles,
  Shuffle,
  Check,
  ChevronsUpDown
} from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  timestamp: Date;
  width: number;
  height: number;
}

const TextToImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState('image');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [placeDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const createdUrlsRef = useRef<string[]>([]);
  const isGeneratingRef = useRef(false);
  const savingRef = useRef<Set<string>>(new Set());

  // Art styles comprehensive list
  const artStyles = [
    "realistic", "cinematic", "cyberpunk", "anime", "manga", "ghibli", "comic", "impressionist", "pixel art", "abstract", "sketch", "fantasy", "3d render", "watercolor", "oil painting", "pop art", "steampunk", "digital painting", "cartoon", "gothic", "isometric", "sci-fi", "minimalist", "vaporwave", "synthwave", "dystopian", "utopian", "art deco", "art nouveau", "cubist", "surrealist", "futuristic", "retrowave", "neo-expressionist", "street art", "graffiti", "mural", "mosaic", "stained glass", "geometric", "abstract expressionism", "pointillism", "charcoal", "pencil sketch", "ink wash", "line art", "pop surrealism", "low poly", "voxel art", "vector art", "comic book", "cartoon modern", "traditional painting", "concept art", "matte painting", "photo realistic", "hdr photography", "vintage photograph", "blueprint", "schematic", "technical drawing", "infographic", "diagrammatic", "hieroglyphic", "cave painting", "tribal art", "african art", "asian art", "western art", "mythological", "horror", "gore", "macabre", "dark fantasy", "sci-fi horror", "post-apocalyptic", "urbex photography", "wildlife photography", "landscape photography", "portraiture", "still life", "botanical illustration", "zoological illustration", "anatomical drawing", "architectural sketch", "cityscape", "seascape", "space art", "astrophotography", "underwater art", "macro photography", "microscopic art", "infrared art", "light painting", "smoke art", "sand art", "watercolour sketch", "acrylic painting", "gouache", "pastel", "fauvism", "expressionism", "suprematism", "constructivism", "dadaism", "minimalism", "op art", "kinetic art", "photorealism", "hyperrealism", "romanticism", "baroque", "rococo", "neoclassicism", "pre-raphaelite", "symbolism", "divisionism", "luminism", "tonalism", "hudson river school", "ashcan school", "precisionism", "regionalism", "social realism", "magic realism", "fantastic realism", "naive art", "outsider art", "folk art", "self-taught art", "graffito", "body art", "land art", "environmental art", "performance art", "video art", "sound art", "bio art", "light art", "textile art", "glass art", "ceramic art", "jewelry design", "fashion illustration", "industrial design", "automotive art", "architectural visualization", "scientific illustration", "medical illustration", "forensic art", "color manga", "color sketch", "logo", "icon", "ads", "cyberpunk watercolor", "anime gothic", "pixel noir", "steampunk fantasy", "retro futurism", "sci-fi impressionism", "minimalist dystopian", "vaporwave botanical", "graffiti pop art", "mythological surrealism", "glitch art", "fractal art", "ai collage", "neon holographic", "augmented reality style", "liquid chrome", "synth organic", "bioluminescent art", "data visualization art", "dreamcore", "weirdcore", "celestial fantasy", "underwater cyberpunk", "dark fairytale", "post-apocalyptic nature", "interdimensional travel", "time-shifted art", "ethereal portraits", "frozen wasteland", "solar punk", "parallel universe art", "cyberpunk origami", "glass neon", "digital stained glass", "astral geometry", "chromatic smoke art", "dreamy pastel noir", "cyber samurai", "floating island fantasy", "frozen neon", "underwater steampunk", "shattered reality", "celestial watercolor", "paper cutout 3d", "neon tribal", "glass forest", "liquid metal", "mechanical nature", "holographic portraits", "luminous ink wash", "dark academia", "techno graffiti", "zero gravity cities", "fire & ice duality", "dreams in glass", "cosmic mosaic", "biomechanical horror", "cyberpunk jungle", "time fracture art", "rainbow mist", "ghost light", "fractal forest", "golden hour fantasy", "underwater cosmos", "tech bloom", "ancient tech ruins", "arcane circuits", "neon rain", "infinite spiral worlds", "shadow light contrast", "electric ice sculptures", "mythic bioluminescence", "paint splash universe", "shimmering desert", "firefly nights", "wired dreams", "ocean punk", "ai surrealism", "blood moon fantasy", "steam & stars", "ethereal silk art", "light beam architecture", "glass ocean", "rainbow circuitry", "toxic beauty", "shadow puppet art", "neon sandstorm", "crystal punk", "mirror world", "paint drip surrealism", "prismatic shadows", "stormlight fantasy", "electric aurora", "techno mythos", "molten core art", "lunar glass cities", "chromatic steampunk", "floating lantern realms", "laser horizon", "frozen galaxy", "quantum dreams", "eclipse realism", "bio-steel creatures", "woven light art", "retro arcade pixelism", "fogpunk", "prism rain", "cyber desert mirage", "blood crystal landscapes", "lava flow cities", "sky tunnels", "neon coral reef", "shattered moon", "starfall skies", "silver mist realism", "deep sea mecha", "aurora gothic", "cosmic origami", "jungle mech fusion", "electric feathered beasts", "hologram graffiti", "toxic jungle", "bioluminescent desert", "infinite mirror maze", "steamstorm skies", "pixel noir fantasy", "shattered light art", "solar flare city", "mecha samurai dreams", "icebound neon forest", "time loop art", "glass volcano", "mechanical butterfly garden", "asteroid colony realism", "shadow neon fusion", "blood rain dystopia", "luminous cave worlds", "neon storm ocean", "cloudpunk", "dragonpunk", "glitchpunk"
  ];

  // Places comprehensive list
  const places = [
    "beach", "mountain", "forest", "city", "desert", "ocean", "lake", "river", "waterfall", "cave", "garden", "park", "countryside", "valley", "hill", "meadow", "field", "island", "volcano", "canyon", "jungle", "rainforest", "savanna", "arctic", "tundra", "glacier", "cliff", "lighthouse", "bridge", "castle", "palace", "temple", "church", "mosque", "cathedral", "monastery", "ruins", "ancient city", "modern city", "skyscraper", "downtown", "suburban", "village", "town", "marketplace", "street", "alley", "square", "plaza", "courtyard", "rooftop", "balcony", "window", "doorway", "interior", "living room", "bedroom", "kitchen", "bathroom", "library", "office", "studio", "workshop", "garage", "basement", "attic", "corridor", "staircase", "elevator", "restaurant", "cafe", "bar", "hotel", "hospital", "school", "university", "museum", "gallery", "theater", "cinema", "concert hall", "stadium", "gym", "spa", "shop", "mall", "supermarket", "warehouse", "factory", "farm", "barn", "stable", "greenhouse", "laboratory", "space station", "spaceship", "underwater", "submarine", "airplane", "train", "car", "boat", "yacht", "pier", "harbor", "port", "airport", "train station", "subway", "tunnel", "road", "highway", "pathway", "sidewalk", "playground", "amusement park", "zoo", "aquarium", "botanical garden", "cemetery", "graveyard", "monument", "statue", "fountain", "pond", "pool", "hot spring", "spa resort", "resort", "cabin", "tent", "campsite", "treehouse", "windmill", "tower", "fortress", "bunker", "underground", "mine", "quarry", "construction site", "demolition site", "abandoned building", "ghost town", "post-apocalyptic", "dystopian city", "utopian city", "futuristic city", "cyberpunk city", "steampunk city", "medieval town", "ancient rome", "ancient greece", "ancient egypt", "ancient china", "ancient japan", "wild west", "pirate ship", "viking village", "fairy tale castle", "enchanted forest", "magical realm", "fantasy world", "alien planet", "mars", "moon", "space", "nebula", "galaxy", "black hole", "wormhole", "parallel dimension", "virtual reality", "digital world", "cyberspace", "matrix", "dreamscape", "nightmare", "heaven", "hell", "purgatory", "limbo", "void", "nowhere"
  ];

  // Settings state
  const [selectedModel, setSelectedModel] = useState('flux');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [customWidth, setCustomWidth] = useState('1024');
  const [customHeight, setCustomHeight] = useState('1024');
  const [style, setStyle] = useState('realistic');
  const [place, setPlace] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState<string>('');
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [shareToGallery, setShareToGallery] = useState(true);
  const [savingImages, setSavingImages] = useState<Set<string>>(new Set());
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());

  // Cleanup object URLs only on component unmount
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Simplified configuration
  const guidance = '7.5';
  const strength = '0.8';

  // Helper function to calculate dimensions from aspect ratio
  const getDimensions = () => {
    if (aspectRatio === 'custom') {
      // Clamp and round to nearest multiple of 64 for API compatibility
      const clampAndRound = (value: string, min = 256, max = 1536) => {
        const num = parseInt(value) || 1024;
        const clamped = Math.max(min, Math.min(max, num));
        return Math.round(clamped / 64) * 64;
      };
      return [clampAndRound(customWidth), clampAndRound(customHeight)];
    }
    
    // Use standard, API-friendly dimensions that are multiples of 64
    switch (aspectRatio) {
      case '1:1':
        return [1024, 1024];
      case '16:9':
        return [1024, 576];  // 1024/576 ≈ 1.78 (16:9)
      case '4:3':
        return [1024, 768];  // 1024/768 ≈ 1.33 (4:3)
      case '9:16':
        return [576, 1024];  // 576/1024 ≈ 0.56 (9:16)
      default:
        return [1024, 1024];
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper function to save image to gallery
  const saveToGallery = async (image: GeneratedImage, imageBlob: Blob) => {
    try {
      const base64Data = await blobToBase64(imageBlob);
      
      await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: image.prompt,
          negativePrompt: image.negativePrompt,
          model: image.model,
          width: image.width,
          height: image.height,
          imageData: base64Data,
          artStyle: style, // Include the selected art style
          userDisplayName: 'Anonymous User' // For now, we'll use anonymous
        }),
      });
      
      toast({
        title: "Shared to gallery!",
        description: "Your image is now visible in the community gallery.",
      });
    } catch (error) {
      console.error('Failed to save image to gallery:', error);
      toast({
        title: "Share failed",
        description: "Could not share image to gallery. Image saved locally.",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate a single image
  const generateSingleImage = async (promptToUse: string, imageIndex: number): Promise<GeneratedImage> => {
    let enhancedPrompt = promptToUse;
    
    // Add place if selected
    if (place.trim()) {
      enhancedPrompt += ` in ${place}`;
    }
    
    // Add style
    enhancedPrompt += `, ${style} style`;
    
    // Add negative prompt if provided
    if (negativePrompt.trim()) {
      enhancedPrompt += `, --no ${negativePrompt.trim()}`;
    }
    
    const [width, height] = getDimensions();
    
    // Determine API based on model
    let url: string;
    const xevenModels = ['flux-schnell', 'flux-real'];
    const pollinationsModels = ['flux', 'turbo', 'image-4', 'image-4-ultra'];
    
    if (xevenModels.includes(selectedModel)) {
      // Use xeven.workers.dev API with aspect ratio support
      url = `https://ai-image-api.xeven.workers.dev/img?prompt=${encodeURIComponent(enhancedPrompt)}&model=${selectedModel}&guidance=${guidance}&strength=${strength}&width=${width}&height=${height}`;
    } else if (pollinationsModels.includes(selectedModel)) {
      // Use pollinations.ai API
      const actualSeed = useRandomSeed ? Math.floor(Math.random() * 1000000) : (parseInt(seed) || Math.floor(Math.random() * 1000000));
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${actualSeed}&model=${selectedModel}&nologo=true`;
    } else {
      throw new Error('Unknown model selected');
    }
    
    // Proper retry logic with exponential backoff
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      let controller: AbortController | null = null;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      
      try {
        controller = new AbortController();
        // Much more generous timeouts to allow for slow AI image generation APIs
        // Progressive timeout increases for retries: 60s, 90s, 120s
        const baseTimeout = 60000; // 60 seconds base
        const timeoutMultiplier = attempt; // 1x, 2x, 3x for attempts
        const timeoutDelay = baseTimeout * timeoutMultiplier;
        timeoutId = setTimeout(() => {
          if (controller) {
            controller.abort(`Request timeout after ${timeoutDelay / 1000} seconds (attempt ${attempt})`);
          }
        }, timeoutDelay);
        
        response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'image/*'
          }
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (response.ok) break;
        
        lastError = new Error(`API Error: ${response.status} - ${response.statusText || 'Unknown error'}`);
        
        // Apply exponential backoff with jitter for all non-OK responses
        if (attempt < 3) {
          const baseDelay = Math.pow(2, attempt) * 1000; // Exponential: 2s, 4s
          const jitter = Math.random() * 1000; // Add up to 1s jitter
          await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
        }
      } catch (error) {
        // Ensure timeout is cleared in case of any error
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (error instanceof Error) {
          if (error.name === 'AbortError' || error.message.includes('aborted')) {
            lastError = new Error(`Request timeout for image ${imageIndex + 1} - please try again`);
          } else if (error.message === 'Failed to fetch') {
            lastError = new Error('Network error - please check your connection');
          } else {
            lastError = error;
          }
        } else {
          lastError = new Error('Unknown error occurred');
        }
        
        // For timeouts, still retry if we have attempts left
        if (attempt < 3) {
          const baseDelay = Math.pow(2, attempt) * 1000;
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
        }
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error(`Image generation service is currently unavailable for image ${imageIndex + 1}`);
    }
    
    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error(`Empty response from image generation service for image ${imageIndex + 1}`);
    }
    
    const imgUrl = URL.createObjectURL(blob);
    
    // Track the created URL for cleanup
    createdUrlsRef.current.push(imgUrl);
    
    // Generate unique ID with image index to avoid collisions
    const newImage: GeneratedImage = {
      id: `${Date.now()}-${imageIndex}-${Math.random().toString(36).substr(2, 9)}`,
      url: imgUrl,
      prompt: promptToUse,
      negativePrompt: negativePrompt.trim() || undefined,
      model: selectedModel,
      timestamp: new Date(),
      width: width,
      height: height,
    };
    
    // Save to gallery if sharing is enabled
    if (shareToGallery) {
      // Don't await this to avoid blocking the UI
      saveToGallery(newImage, blob).catch(console.error);
    }
    
    return newImage;
  };

  const generateImage = async (customPrompt?: string) => {
    // Use custom prompt or fall back to state prompt
    const promptToUse = customPrompt || prompt;
    
    // Atomic check to prevent concurrent generations
    if (isGeneratingRef.current) {
      toast({
        title: "Generation in progress",
        description: "Please wait for the current generation to complete.",
        variant: "destructive",
      });
      return;
    }

    if (!promptToUse.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe what you'd like to create.",
        variant: "destructive",
      });
      return;
    }

    // Set ref atomically before state
    isGeneratingRef.current = true;
    setIsGenerating(true);
    
    try {
      // Generate all images with slight staggering to reduce API load
      const imagePromises = Array.from({ length: numberOfImages }, (_, i) => {
        // Add a small delay before starting each request to prevent overwhelming the API
        const startDelay = i * 1000; // 0s, 1s, 2s, 3s staggered starts
        
        return new Promise<GeneratedImage | null>(resolve => {
          setTimeout(async () => {
            try {
              const newImage = await generateSingleImage(promptToUse, i);
              // Add each image to the display as it's generated
              setGeneratedImages(prev => [newImage, ...prev]);
              
              // Show progress toast for multiple images
              if (numberOfImages > 1) {
                toast({
                  title: `Image ${i + 1} of ${numberOfImages} generated!`,
                  description: `Generated image ${i + 1} successfully.`,
                });
              }
              
              resolve(newImage);
            } catch (error) {
              // If one image fails, show error but continue with other images
              console.error(`Image ${i + 1} generation failed:`, error);
              toast({
                title: `Image ${i + 1} failed`,
                description: `Could not generate image ${i + 1} of ${numberOfImages}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: "destructive",
              });
              resolve(null);
            }
          }, startDelay);
        });
      });
      
      // Wait for all images to complete (or fail)
      const results = await Promise.all(imagePromises);
      const generatedImagesArray = results.filter((img): img is GeneratedImage => img !== null);
      
      // Final success toast
      if (generatedImagesArray.length > 0) {
        if (numberOfImages === 1) {
          toast({
            title: "Image generated successfully!",
            description: "Your AI-generated image is ready.",
          });
        } else {
          toast({
            title: `Generated ${generatedImagesArray.length} images!`,
            description: `Successfully created ${generatedImagesArray.length} of ${numberOfImages} requested images.`,
          });
        }
      } else {
        throw new Error('No images were generated successfully');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.warn('Image generation failed:', errorMessage);
      
      let userFriendlyMessage = 'Please try again in a moment.';
      
      if (errorMessage.includes('Network error')) {
        userFriendlyMessage = 'Please check your internet connection and try again.';
      } else if (errorMessage.includes('timeout')) {
        userFriendlyMessage = 'The request took too long. Please try again.';
      } else if (errorMessage.includes('unavailable')) {
        userFriendlyMessage = 'The image generation service is temporarily unavailable.';
      }
      
      toast({
        title: "Generation failed",
        description: userFriendlyMessage,
        variant: "destructive",
      });
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  };

  const clearInput = () => {
    setPrompt('');
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded.",
    });
  };

  const regenerateImage = (image: GeneratedImage) => {
    if (isGeneratingRef.current) {
      toast({
        title: "Generation in progress",
        description: "Please wait for the current generation to complete.",
        variant: "destructive",
      });
      return;
    }
    
    // Set both prompt and negative prompt from the stored image
    setPrompt(image.prompt);
    if (image.negativePrompt) {
      setNegativePrompt(image.negativePrompt);
    } else {
      setNegativePrompt('');
    }
    
    generateImage(image.prompt);
  };

  const saveImage = async (image: GeneratedImage) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save images to your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Check if image is already saved - prevent duplicate saves
    if (savedImages.has(image.id)) {
      toast({
        title: "Already saved",
        description: "This image is already in your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Atomic check to prevent duplicate saves in progress
    if (savingRef.current.has(image.id)) {
      toast({
        title: "Save in progress",
        description: "This image is already being saved to your favorites.",
        variant: "destructive",
      });
      return;
    }

    // Mark as being saved atomically
    savingRef.current.add(image.id);
    setSavingImages(prev => {
      const newSet = new Set(prev);
      newSet.add(image.id);
      return newSet;
    });

    try {
      // Convert blob URL back to blob to get the base64 data URL
      const response = await fetch(image.url);
      const blob = await response.blob();
      const base64Data = await blobToBase64(blob);
      
      // Ensure it's a proper data URL
      if (!base64Data.startsWith('data:image/')) {
        throw new Error('Invalid image data format');
      }
      
      await apiRequest('POST', '/api/saved-images', {
        userId: user.uid,
        prompt: image.prompt,
        negativePrompt: image.negativePrompt,
        model: image.model,
        width: image.width,
        height: image.height,
        imageData: base64Data,
        artStyle: style,
        originalImageId: null // This is a generated image, not from community gallery
      });
      
      // Mark image as saved permanently
      setSavedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(image.id);
        return newSet;
      });
      
      toast({
        title: "Image saved",
        description: "Image has been saved to your favorites!",
      });
    } catch (error) {
      console.error('Failed to save image:', error);
      toast({
        title: "Save failed",
        description: "Could not save image to favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Ensure cleanup happens immediately and reliably
      savingRef.current.delete(image.id);
      setSavingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    }
  };

  const editImage = (image: GeneratedImage) => {
    // In a real app, this would open an image editor
    toast({
      title: "Edit feature",
      description: "Image editor will be available soon.",
    });
  };

  const deleteImage = (imageId: string) => {
    let imageToDelete: GeneratedImage | undefined;
    
    setGeneratedImages(prev => {
      imageToDelete = prev.find(img => img.id === imageId);
      return prev.filter(img => img.id !== imageId);
    });
    
    if (imageToDelete) {
      // Defer URL cleanup to avoid potential broken image flash
      setTimeout(() => {
        URL.revokeObjectURL(imageToDelete!.url);
        // Remove from our tracking array
        createdUrlsRef.current = createdUrlsRef.current.filter(url => url !== imageToDelete!.url);
      }, 0);
      
      toast({
        title: "Image deleted",
        description: "The generated image has been removed.",
      });
    }
  };

  const copyPrompt = () => {
    if (prompt.trim()) {
      navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Your prompt has been copied to clipboard.",
      });
    }
  };

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt first",
        description: "Please enter a basic prompt to enhance.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      setPrompt(data.enhancedPrompt);
      
      toast({
        title: "Prompt enhanced!",
        description: "Your prompt has been improved with AI suggestions.",
      });
      
    } catch (error) {
      console.warn('Prompt enhancement failed:', error);
      toast({
        title: "Enhancement failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-4 relative">
      
      {/* Settings Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur border-r border-border/50 z-50 transform transition-transform duration-300 ${settingsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(false)}
              data-testid="button-close-settings"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model-select" data-testid="select-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux-schnell">Flux-Schnell</SelectItem>
                  <SelectItem value="flux-real">Flux-Real</SelectItem>
                  <SelectItem value="flux">Flux (fast)</SelectItem>
                  <SelectItem value="turbo">Turbo</SelectItem>
                  <SelectItem value="image-4">Image-4</SelectItem>
                  <SelectItem value="image-4-ultra">Image-4 Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="ratio-select">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger id="ratio-select" data-testid="select-ratio">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              {aspectRatio === 'custom' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="custom-width" className="text-xs">Width</Label>
                    <Input
                      id="custom-width"
                      type="number"
                      placeholder="1024"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      min="256"
                      max="2048"
                      className="text-sm"
                      data-testid="input-custom-width"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-height" className="text-xs">Height</Label>
                    <Input
                      id="custom-height"
                      type="number"
                      placeholder="1024"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      min="256"
                      max="2048"
                      className="text-sm"
                      data-testid="input-custom-height"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Place */}
            <div className="space-y-2">
              <Label htmlFor="place-select">Place/Location</Label>
              <Popover open={placeDropdownOpen} onOpenChange={setPlaceDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={placeDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-place"
                  >
                    {place
                      ? place.charAt(0).toUpperCase() + place.slice(1)
                      : "Select place..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search places..." />
                    <CommandEmpty>No place found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {places.map((placeOption) => (
                          <CommandItem
                            key={placeOption}
                            value={placeOption}
                            onSelect={(currentValue) => {
                              setPlace(currentValue === place ? "" : currentValue);
                              setPlaceDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                place === placeOption ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {placeOption.charAt(0).toUpperCase() + placeOption.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Choose a location or setting for your image
              </p>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label htmlFor="style-select">Style</Label>
              <Popover open={styleDropdownOpen} onOpenChange={setStyleDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={styleDropdownOpen}
                    className="w-full justify-between"
                    data-testid="select-style"
                  >
                    {style
                      ? style.charAt(0).toUpperCase() + style.slice(1)
                      : "Select style..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search art styles..." />
                    <CommandEmpty>No art style found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {artStyles.map((artStyle) => (
                          <CommandItem
                            key={artStyle}
                            value={artStyle}
                            onSelect={(currentValue) => {
                              setStyle(currentValue === style ? "" : currentValue);
                              setStyleDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                style === artStyle ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {artStyle.charAt(0).toUpperCase() + artStyle.slice(1)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                placeholder="Enter what you don't want in the image (e.g., blurry, low quality, text)"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="min-h-[80px] resize-none"
                data-testid="textarea-negative-prompt"
              />
              <p className="text-xs text-muted-foreground">
                Describe elements you want to avoid in the generated image
              </p>
            </div>

            {/* Number of Images */}
            <div className="space-y-2">
              <Label htmlFor="images-select">Number of Images</Label>
              <Select value={numberOfImages.toString()} onValueChange={(value) => setNumberOfImages(parseInt(value))}>
                <SelectTrigger id="images-select" data-testid="select-images">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Image</SelectItem>
                  <SelectItem value="2">2 Images</SelectItem>
                  <SelectItem value="3">3 Images</SelectItem>
                  <SelectItem value="4">4 Images</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Share to Community */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="share-to-gallery"
                  checked={shareToGallery}
                  onCheckedChange={setShareToGallery}
                  data-testid="switch-share-gallery"
                />
                <Label htmlFor="share-to-gallery">Share to Community Gallery</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, your generated images will be visible to all users in the community gallery.
              </p>
            </div>

            {/* Seed */}
            <div className="space-y-3">
              <Label>Seed</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={useRandomSeed}
                  onCheckedChange={setUseRandomSeed}
                  id="random-seed-toggle"
                  data-testid="switch-random-seed"
                />
                <Label htmlFor="random-seed-toggle" className="text-sm">
                  Random seed
                </Label>
              </div>
              
              {!useRandomSeed && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Enter seed number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="flex-1"
                    min="0"
                    max="999999999"
                    data-testid="input-seed"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSeed(Math.floor(Math.random() * 1000000).toString())}
                    data-testid="button-generate-seed"
                    title="Generate random seed"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {useRandomSeed ? 'A random seed will be used for each generation' : 'Use the same seed to reproduce similar results'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {settingsOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Top Section */}
        <div className="mb-8">
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
              <TabsTrigger 
                value="image" 
                className="data-[state=active]:bg-[#8a3dff] data-[state=active]:text-white"
                data-testid="tab-image"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="tab-video"
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="mt-8">
              {/* Input Section */}
              <Card className="bg-card/50 backdrop-blur border-border/50 mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Describe the piece you want to create..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-lg pr-12"
                        disabled={isGenerating}
                        data-testid="input-prompt"
                      />
                      
                      {/* Mini Enhance Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={enhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        data-testid="button-enhance-mini"
                        title="Enhance prompt with AI"
                      >
                        {isEnhancing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSettingsOpen(true)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-settings"
                          title="Open settings"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyPrompt}
                          disabled={!prompt.trim()}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-copy"
                          title="Copy prompt to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => generateImage()}
                          disabled={isGenerating || !prompt.trim()}
                          className="bg-[#8a3dff] hover:bg-[#7c36e6] text-white px-6"
                          data-testid="button-generate"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {isGenerating ? 'Generating...' : 'Generate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Images Section */}
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  {generatedImages.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8a3dff] rounded-full flex items-center justify-center">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        Click the Generate button to start creating
                      </h3>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Creating your image...</h3>
                      <p className="text-muted-foreground">This may take a few moments</p>
                    </div>
                  )}

                  {generatedImages.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Generated Images</h3>
                        <span className="text-sm text-muted-foreground">
                          {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {generatedImages.map((image) => (
                          <div key={image.id} className="group" data-testid={`image-${image.id}`}>
                            <div 
                              className="relative overflow-hidden rounded-lg bg-muted/50 mb-3"
                              style={{ aspectRatio: `${image.width} / ${image.height}` }}
                            >
                              <img
                                src={image.url}
                                alt={`Generated: ${image.prompt}`}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image.id);
                                }}
                                className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                data-testid={`button-delete-${image.id}`}
                                title="Delete image"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              
                              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex flex-col gap-2">
                                  <p className="text-white text-xs font-medium line-clamp-1 mb-1">
                                    {image.prompt}
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {/* Download Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadImage(image.url, image.prompt);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-download-${image.id}`}
                                      title="Download image"
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      Download
                                    </Button>
                                    
                                    {/* Regenerate Button */}
                                    <Button
                                      variant="secondary" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        regenerateImage(image);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-regenerate-${image.id}`}
                                      title="Regenerate image"
                                    >
                                      <RefreshCw className="w-3 h-3 mr-1" />
                                      Regenerate
                                    </Button>
                                    
                                    {/* Save Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveImage(image);
                                      }}
                                      disabled={savingImages.has(image.id) || savedImages.has(image.id)}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm disabled:opacity-50"
                                      data-testid={`button-save-${image.id}`}
                                      title={
                                        savingImages.has(image.id) 
                                          ? "Saving to favorites..." 
                                          : savedImages.has(image.id) 
                                            ? "Already saved to favorites" 
                                            : "Save to favorites"
                                      }
                                    >
                                      {savingImages.has(image.id) ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : savedImages.has(image.id) ? (
                                        <Check className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Save className="w-3 h-3 mr-1" />
                                      )}
                                      {savingImages.has(image.id) 
                                        ? 'Saving...' 
                                        : savedImages.has(image.id) 
                                          ? 'Saved' 
                                          : 'Save'}
                                    </Button>
                                    
                                    {/* Edit Button */}
                                    <Button
                                      variant="secondary"
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editImage(image);
                                      }}
                                      className="h-7 px-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                                      data-testid={`button-edit-${image.id}`}
                                      title="Edit image (coming soon)"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-muted-foreground">
                              Generated: {image.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="video" className="mt-8">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-muted/50 rounded-lg mb-6 flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Video generation coming soon
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stay tuned for AI video generation features
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TextToImageGenerator;