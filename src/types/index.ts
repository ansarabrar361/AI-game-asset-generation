export interface GeneratedAsset {
  id: string;
  type: 'background' | 'character';
  name: string;
  prompt: string;
  imageUrl: string;
  variations?: AssetVariation[];
  createdAt: Date;
  tags: string[];
  style: string;
}

export interface AssetVariation {
  id: string;
  name: string;
  type: 'idle' | 'walk' | 'run' | 'jump' | 'die' | 'attack' | 'up' | 'down' | 'left' | 'right';
  imageUrl: string;
}

export interface GenerationRequest {
  type: 'background' | 'character';
  prompt: string;
  style: string;
  additionalParams?: Record<string, any>;
}

export interface BackgroundSettings {
  environment: 'forest' | 'desert' | 'city' | 'space' | 'dungeon' | 'underwater' | 'custom';
  style: 'pixel-art' | 'realistic' | 'cartoon' | 'watercolor' | 'cyberpunk' | 'fantasy';
  mood: 'bright' | 'dark' | 'mysterious' | 'cheerful' | 'ominous';
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  customPrompt?: string;
}

export interface CharacterSettings {
  characterType: 'hero' | 'villain' | 'npc' | 'monster' | 'animal' | 'robot' | 'custom';
  style: 'pixel-art' | 'realistic' | 'cartoon' | 'anime' | 'chibi' | 'medieval';
  generateVariations: boolean;
  customPrompt?: string;
}