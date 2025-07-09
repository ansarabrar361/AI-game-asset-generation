import { GenerationRequest, GeneratedAsset, AssetVariation } from '../types';

// AI Image Generation Service with multiple providers
class AIImageGenerator {
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  private stabilityApiKey = import.meta.env.VITE_STABILITY_API_KEY;
  
  // Track generated prompts to ensure uniqueness
  private generatedPrompts = new Set<string>();
  private imageCache = new Map<string, string>();

  async generateAsset(request: GenerationRequest): Promise<GeneratedAsset> {
    try {
      // Check if any real API keys are available
      const hasRealAPI = this.openaiApiKey || this.stabilityApiKey;
      
      if (!hasRealAPI) {
        throw new Error('No AI API keys configured. Please add at least one API key to your .env file and restart the development server.');
      }
      
      let enhancedPrompt = await this.enhancePrompt(request.prompt, request.style, request.type);
      
      // Add uniqueness factors to prevent duplicate generation
      enhancedPrompt = this.addUniquenessFactors(enhancedPrompt, request.type);
      
      // Generate main asset image with real AI
      const imageUrl = await this.generateImage(enhancedPrompt, request.style, request.type);
      
      const asset: GeneratedAsset = {
        id: this.generateId(),
        type: request.type,
        name: this.generateName(request.type, request.prompt),
        prompt: request.prompt,
        imageUrl,
        createdAt: new Date(),
        tags: this.generateTags(request.prompt, request.style),
        style: request.style,
      };

      // Generate variations for characters
      if (request.type === 'character' && request.additionalParams?.generateVariations) {
        asset.variations = await this.generateCharacterVariations(enhancedPrompt, request.style);
      }

      return asset;
    } catch (error) {
      console.error('Failed to generate asset:', error);
      throw error;
    }
  }

  private addUniquenessFactors(prompt: string, type: 'background' | 'character'): string {
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Add variety descriptors to make each generation unique
    const varietyDescriptors = {
      background: [
        'unique perspective', 'different angle', 'varied composition', 'alternative view',
        'distinct atmosphere', 'unique lighting', 'different mood', 'varied elements',
        'creative composition', 'fresh perspective', 'original design', 'innovative layout'
      ],
      character: [
        'unique design', 'distinctive features', 'original appearance', 'creative style',
        'different pose', 'varied expression', 'unique personality', 'distinct look',
        'creative design', 'original character', 'innovative style', 'fresh approach'
      ]
    };

    const descriptors = varietyDescriptors[type];
    const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
    
    // Add color variations
    const colorVariations = [
      'vibrant colors', 'muted tones', 'warm palette', 'cool palette', 'earth tones',
      'bright colors', 'pastel colors', 'rich colors', 'subtle colors', 'bold colors'
    ];
    const randomColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
    
    // Add detail variations
    const detailVariations = [
      'highly detailed', 'intricate details', 'fine details', 'elaborate design',
      'detailed textures', 'rich details', 'complex design', 'ornate details'
    ];
    const randomDetail = detailVariations[Math.floor(Math.random() * detailVariations.length)];
    
    // Create a unique prompt hash to avoid exact duplicates
    const promptHash = this.hashString(prompt + timestamp + randomSeed);
    
    return `${prompt}, ${randomDescriptor}, ${randomColor}, ${randomDetail}, seed:${randomSeed}, id:${promptHash}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private async enhancePrompt(prompt: string, style: string, type: 'background' | 'character'): Promise<string> {
    // Use Gemini to enhance prompts if available
    if (this.geminiApiKey) {
      try {
        return await this.enhancePromptWithGemini(prompt, style, type);
      } catch (error) {
        console.warn('Failed to enhance prompt with Gemini, using basic enhancement:', error);
      }
    }
    
    // Fallback to basic prompt enhancement
    return this.createEnhancedPrompt(prompt, style, type);
  }

  private createEnhancedPrompt(prompt: string, style: string, type: 'background' | 'character'): string {
    const styleModifiers = {
      'pixel-art': 'pixel art, 8-bit, retro gaming style, crisp pixels, limited color palette, sprite art',
      'realistic': 'photorealistic, highly detailed, professional quality, sharp focus, realistic rendering',
      'cartoon': 'cartoon style, vibrant colors, stylized, animated look, clean lines, cel-shaded',
      'watercolor': 'watercolor painting, soft brushstrokes, artistic, painted texture, flowing colors',
      'cyberpunk': 'cyberpunk aesthetic, neon colors, futuristic, dark atmosphere, sci-fi, glowing elements',
      'fantasy': 'fantasy art, magical, mystical, detailed fantasy illustration, enchanted atmosphere',
      'anime': 'anime style, manga art, Japanese animation style, expressive, dynamic poses',
      'chibi': 'chibi style, cute, small proportions, kawaii, adorable, big eyes',
      'medieval': 'medieval fantasy, historical, detailed armor and weapons, ancient, stone textures'
    };

    const typeModifiers = {
      'background': 'game background, environment art, landscape, scene, no characters, tileable pattern',
      'character': 'game character, sprite art, character design, full body, standing pose, transparent background'
    };

    const qualityModifiers = 'high quality, game asset, professional game art, clean composition, suitable for games, 4K resolution';
    
    const styleText = styleModifiers[style as keyof typeof styleModifiers] || style;
    const typeText = typeModifiers[type];
    
    return `${prompt}, ${styleText}, ${typeText}, ${qualityModifiers}`;
  }

  private async enhancePromptWithGemini(prompt: string, style: string, type: 'background' | 'character'): Promise<string> {
    try {
      const enhancementPrompt = `You are an expert at creating detailed, unique prompts for AI image generation for game assets. 

Enhance this ${type} prompt for ${style} style: "${prompt}"

Requirements:
- Make it specific and detailed for game asset creation
- Include appropriate ${style} style descriptors
- Add quality and technical specifications
- Make it UNIQUE and creative to avoid repetitive results
- Include varied visual elements and composition details
- ${type === 'background' ? 'Ensure no characters are mentioned, focus on environment details' : 'Focus on character design, pose, and unique visual features'}
- Add creative elements that make this generation distinct from others

Return only the enhanced prompt, nothing else. Make it creative and unique.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancementPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9, // Higher temperature for more creativity
            maxOutputTokens: 300,
            topP: 0.9,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt with Gemini');
      }

      const data = await response.json();
      const enhancedPrompt = data.candidates[0].content.parts[0].text.trim();
      
      // Clean up the response to ensure it's just the prompt
      return enhancedPrompt.replace(/^["']|["']$/g, '');
    } catch (error) {
      console.warn('Gemini prompt enhancement failed:', error);
      return this.createEnhancedPrompt(prompt, style, type);
    }
  }

  private async generateImage(prompt: string, style: string, type: 'background' | 'character'): Promise<string> {
    const errors: string[] = [];

    // Check cache first to avoid duplicate API calls
    const cacheKey = this.hashString(prompt + style + type);
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    // Try OpenAI DALL-E first (best quality)
    if (this.openaiApiKey) {
      try {
        const imageUrl = await this.generateWithOpenAI(prompt);
        this.imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      } catch (error) {
        errors.push(`OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Try Stability AI as fallback
    if (this.stabilityApiKey) {
      try {
        const imageUrl = await this.generateWithStability(prompt);
        this.imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      } catch (error) {
        errors.push(`Stability AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // If no API keys are configured
    if (!this.openaiApiKey && !this.stabilityApiKey) {
      throw new Error('No AI API keys configured. Please add at least one API key to your .env file.');
    }

    // If all services failed
    throw new Error(`All AI services failed:\n${errors.join('\n')}`);
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.slice(0, 4000), // DALL-E 3 has a 4000 character limit
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data[0].url;
  }

  private async generateWithStability(prompt: string): Promise<string> {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stabilityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        style_preset: 'digital-art',
        seed: Math.floor(Math.random() * 4294967295) // Random seed for variety
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Stability AI error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return `data:image/png;base64,${data.artifacts[0].base64}`;
  }

  private async generateCharacterVariations(basePrompt: string, style: string): Promise<AssetVariation[]> {
    const variations: AssetVariation[] = [];
    const variationTypes = [
      { type: 'idle' as const, prompt: 'idle standing pose, neutral stance, front view, relaxed posture' },
      { type: 'walk' as const, prompt: 'walking animation frame, mid-step, side view, natural gait' },
      { type: 'run' as const, prompt: 'running pose, dynamic movement, action stance, speed lines' },
      { type: 'jump' as const, prompt: 'jumping in air, legs bent, upward motion, dynamic pose' },
      { type: 'die' as const, prompt: 'defeated pose, fallen or collapsing, dramatic death scene' },
      { type: 'attack' as const, prompt: 'attack pose, weapon ready, combat stance, aggressive posture' },
      { type: 'up' as const, prompt: 'looking upward, head tilted up, reaching up, climbing motion' },
      { type: 'down' as const, prompt: 'crouched down, looking down, defensive pose, ducking' },
    ];
    
    // Generate variations sequentially to avoid rate limits
    for (const variation of variationTypes) {
      try {
        // Create unique prompts for each variation
        const cleanBasePrompt = basePrompt.replace(/standing pose|idle|neutral stance/gi, '').trim();
        const uniqueId = this.generateId();
        const fullPrompt = `${cleanBasePrompt}, ${variation.prompt}, character sprite, game asset, clean background, variation:${uniqueId}`;
        
        const imageUrl = await this.generateImage(fullPrompt, style, 'character');
        
        variations.push({
          id: this.generateId(),
          name: variation.type.charAt(0).toUpperCase() + variation.type.slice(1),
          type: variation.type,
          imageUrl,
        });

        // Add delay between generations to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Failed to generate ${variation.type} variation:`, error);
        // Continue with other variations even if one fails
      }
    }

    return variations;
  }

  // Export functionality
  async exportAsset(asset: GeneratedAsset, format: 'png' | 'jpg' | 'zip' = 'png'): Promise<void> {
    try {
      if (format === 'zip' && asset.variations && asset.variations.length > 0) {
        // Export as ZIP with all variations
        await this.exportAssetPackage(asset);
      } else {
        // Export single image
        await this.downloadImage(asset.imageUrl, `${asset.name}.${format}`);
      }
    } catch (error) {
      console.error('Failed to export asset:', error);
      throw new Error('Failed to export asset. Please try again.');
    }
  }

  async exportMultipleAssets(assets: GeneratedAsset[]): Promise<void> {
    try {
      // Create a ZIP file with all assets
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const asset of assets) {
        // Add main asset
        const mainImageBlob = await this.fetchImageAsBlob(asset.imageUrl);
        zip.file(`${asset.name}.png`, mainImageBlob);

        // Add variations if they exist
        if (asset.variations && asset.variations.length > 0) {
          const variationsFolder = zip.folder(`${asset.name}_variations`);
          for (const variation of asset.variations) {
            const variationBlob = await this.fetchImageAsBlob(variation.imageUrl);
            variationsFolder?.file(`${variation.name}.png`, variationBlob);
          }
        }

        // Add metadata
        const metadata = {
          name: asset.name,
          type: asset.type,
          style: asset.style,
          prompt: asset.prompt,
          tags: asset.tags,
          createdAt: asset.createdAt,
          variations: asset.variations?.map(v => ({
            name: v.name,
            type: v.type
          }))
        };
        zip.file(`${asset.name}_metadata.json`, JSON.stringify(metadata, null, 2));
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `game_assets_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export multiple assets:', error);
      throw new Error('Failed to export assets. Please try again.');
    }
  }

  private async exportAssetPackage(asset: GeneratedAsset): Promise<void> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add main asset
    const mainImageBlob = await this.fetchImageAsBlob(asset.imageUrl);
    zip.file(`${asset.name}.png`, mainImageBlob);

    // Add variations
    if (asset.variations && asset.variations.length > 0) {
      for (const variation of asset.variations) {
        const variationBlob = await this.fetchImageAsBlob(variation.imageUrl);
        zip.file(`${variation.name}.png`, variationBlob);
      }
    }

    // Add metadata file
    const metadata = {
      name: asset.name,
      type: asset.type,
      style: asset.style,
      prompt: asset.prompt,
      tags: asset.tags,
      createdAt: asset.createdAt,
      variations: asset.variations?.map(v => ({
        name: v.name,
        type: v.type
      }))
    };
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${asset.name}_package.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private async fetchImageAsBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return response.blob();
  }

  private async downloadImage(imageUrl: string, filename: string): Promise<void> {
    const blob = await this.fetchImageAsBlob(imageUrl);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Utility method to check which services are available
  getAvailableServices(): string[] {
    const services: string[] = [];
    if (this.openaiApiKey) services.push('OpenAI DALL-E');
    if (this.geminiApiKey) services.push('Google Gemini (Prompt Enhancement)');
    if (this.stabilityApiKey) services.push('Stability AI');
    return services;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateName(type: string, prompt: string): string {
    const words = prompt.split(' ').filter(word => word.length > 3);
    const randomWord = words[Math.floor(Math.random() * words.length)] || type;
    const timestamp = Date.now().toString(36).slice(-4);
    return `${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)} ${timestamp}`;
  }

  private generateTags(prompt: string, style: string): string[] {
    const commonTags = [style, 'AI-generated', 'game-asset'];
    const promptWords = prompt.toLowerCase().split(' ').filter(word => word.length > 3);
    const uniqueTag = `gen-${Date.now().toString(36)}`;
    return [...commonTags, ...promptWords.slice(0, 3), uniqueTag];
  }
}

export const aiImageGenerator = new AIImageGenerator();