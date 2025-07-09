import React, { useState } from 'react';
import { User, Loader2, Sparkles, Zap } from 'lucide-react';
import { CharacterSettings, GeneratedAsset } from '../types';
import { aiImageGenerator } from '../services/aiImageGenerator';

interface CharacterGeneratorProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({ onAssetGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<CharacterSettings>({
    characterType: 'hero',
    style: 'pixel-art',
    generateVariations: true,
    customPrompt: '',
  });

  const characterTypes = [
    { id: 'hero', label: 'Hero', description: 'Protagonist characters for adventures' },
    { id: 'villain', label: 'Villain', description: 'Antagonist characters and bosses' },
    { id: 'npc', label: 'NPC', description: 'Non-player characters for interaction' },
    { id: 'monster', label: 'Monster', description: 'Creatures and enemies' },
    { id: 'animal', label: 'Animal', description: 'Wildlife and companion creatures' },
    { id: 'robot', label: 'Robot', description: 'Mechanical and AI characters' },
    { id: 'custom', label: 'Custom', description: 'Use custom prompt for unique characters' },
  ];

  const styles = [
    { id: 'pixel-art', label: 'Pixel Art', description: 'Retro 8-bit or 16-bit sprite style' },
    { id: 'realistic', label: 'Realistic', description: 'Detailed realistic rendering' },
    { id: 'cartoon', label: 'Cartoon', description: 'Stylized cartoon character' },
    { id: 'anime', label: 'Anime', description: 'Japanese animation style' },
    { id: 'chibi', label: 'Chibi', description: 'Cute small character style' },
    { id: 'medieval', label: 'Medieval', description: 'Historical fantasy style' },
  ];

  const generateCharacter = async () => {
    setIsGenerating(true);
    try {
      let prompt: string;
      
      if (settings.characterType === 'custom') {
        prompt = settings.customPrompt || 'fantasy character';
      } else {
        // Create more specific prompts based on character type
        const characterDescriptions = {
          hero: 'heroic protagonist character, brave warrior, adventurer with noble appearance',
          villain: 'antagonist character, dark and menacing, evil boss design',
          npc: 'friendly non-player character, approachable villager or merchant',
          monster: 'creature enemy, beast or monster design, threatening appearance',
          animal: 'animal companion or wildlife, natural creature design',
          robot: 'mechanical character, android or robot design, futuristic technology'
        };
        
        const charDescription = characterDescriptions[settings.characterType as keyof typeof characterDescriptions];
        prompt = `${charDescription}, full body character design, standing pose`;
      }
      
      const asset = await aiImageGenerator.generateAsset({
        type: 'character',
        prompt,
        style: settings.style,
        additionalParams: settings,
      });

      onAssetGenerated(asset);
    } catch (error) {
      console.error('Failed to generate character:', error);
      // Show user-friendly error message
      alert(`Failed to generate character: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Character Generator</h2>
        <p className="text-lg text-gray-600">Create characters with complete sprite sets</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Character Type</label>
              <div className="grid grid-cols-1 gap-2">
                {characterTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSettings(prev => ({ ...prev, characterType: type.id as any }))}
                    className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                      settings.characterType === type.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {settings.characterType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                <textarea
                  value={settings.customPrompt}
                  onChange={(e) => setSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="Describe your custom character..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Art Style</label>
              <div className="grid grid-cols-1 gap-2">
                {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSettings(prev => ({ ...prev, style: style.id as any }))}
                    className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                      settings.style === style.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Auto-Generate Variations</span>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, generateVariations: !prev.generateVariations }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.generateVariations ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.generateVariations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Automatically generate character variations including:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Idle state</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Walking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Running</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Jumping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Death animation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Attack motion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Up/Down motion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Directional sprites</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={generateCharacter}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Character & Variations...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Character</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterGenerator;