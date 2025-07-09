import React, { useState } from 'react';
import { Palette, Loader2, Sparkles, Download } from 'lucide-react';
import { BackgroundSettings, GeneratedAsset } from '../types';
import { aiImageGenerator } from '../services/aiImageGenerator';

interface BackgroundGeneratorProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const BackgroundGenerator: React.FC<BackgroundGeneratorProps> = ({ onAssetGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<BackgroundSettings>({
    environment: 'forest',
    style: 'pixel-art',
    mood: 'bright',
    timeOfDay: 'day',
    customPrompt: '',
  });

  const environments = [
    { id: 'forest', label: 'Forest', description: 'Lush green forests with trees and wildlife' },
    { id: 'desert', label: 'Desert', description: 'Sandy dunes and oasis landscapes' },
    { id: 'city', label: 'City', description: 'Urban environments with buildings and streets' },
    { id: 'space', label: 'Space', description: 'Cosmic scenes with planets and stars' },
    { id: 'dungeon', label: 'Dungeon', description: 'Dark underground chambers and corridors' },
    { id: 'underwater', label: 'Underwater', description: 'Ocean depths with marine life' },
    { id: 'custom', label: 'Custom', description: 'Use custom prompt for unique environments' },
  ];

  const styles = [
    { id: 'pixel-art', label: 'Pixel Art', description: 'Retro 8-bit or 16-bit style' },
    { id: 'realistic', label: 'Realistic', description: 'Photo-realistic rendering' },
    { id: 'cartoon', label: 'Cartoon', description: 'Stylized cartoon look' },
    { id: 'watercolor', label: 'Watercolor', description: 'Painted watercolor effect' },
    { id: 'cyberpunk', label: 'Cyberpunk', description: 'Futuristic neon-lit aesthetic' },
    { id: 'fantasy', label: 'Fantasy', description: 'Magical and mystical appearance' },
  ];

  const moods = [
    { id: 'bright', label: 'Bright', description: 'Well-lit and cheerful' },
    { id: 'dark', label: 'Dark', description: 'Shadowy and atmospheric' },
    { id: 'mysterious', label: 'Mysterious', description: 'Enigmatic and intriguing' },
    { id: 'cheerful', label: 'Cheerful', description: 'Happy and vibrant' },
    { id: 'ominous', label: 'Ominous', description: 'Threatening and foreboding' },
  ];

  const timeOptions = [
    { id: 'dawn', label: 'Dawn', description: 'Early morning light' },
    { id: 'day', label: 'Day', description: 'Bright daylight' },
    { id: 'dusk', label: 'Dusk', description: 'Evening twilight' },
    { id: 'night', label: 'Night', description: 'Dark nighttime' },
  ];

  const generateBackground = async () => {
    setIsGenerating(true);
    try {
      let prompt: string;
      
      if (settings.environment === 'custom') {
        prompt = settings.customPrompt || 'fantasy landscape';
      } else {
        // Create more specific prompts based on environment
        const environmentDescriptions = {
          forest: 'dense forest with tall trees, lush vegetation, woodland atmosphere',
          desert: 'vast desert landscape with sand dunes, arid environment, desert plants',
          city: 'urban cityscape with buildings, streets, metropolitan environment',
          space: 'outer space scene with planets, stars, cosmic nebula, sci-fi atmosphere',
          dungeon: 'underground dungeon with stone walls, torches, medieval architecture',
          underwater: 'underwater scene with coral reefs, marine life, ocean depths'
        };
        
        const envDescription = environmentDescriptions[settings.environment as keyof typeof environmentDescriptions];
        const moodDescription = settings.mood === 'bright' ? 'well-lit, vibrant colors' :
                              settings.mood === 'dark' ? 'dark atmosphere, shadows' :
                              settings.mood === 'mysterious' ? 'mysterious, foggy, enigmatic' :
                              settings.mood === 'cheerful' ? 'cheerful, colorful, happy atmosphere' :
                              'ominous, threatening, dark clouds';
        
        const timeDescription = settings.timeOfDay === 'dawn' ? 'dawn lighting, sunrise' :
                              settings.timeOfDay === 'day' ? 'bright daylight, clear sky' :
                              settings.timeOfDay === 'dusk' ? 'sunset, golden hour lighting' :
                              'nighttime, moonlight, stars';
        
        prompt = `${envDescription}, ${moodDescription}, ${timeDescription}`;
      }
      
      const asset = await aiImageGenerator.generateAsset({
        type: 'background',
        prompt,
        style: settings.style,
        additionalParams: settings,
      });

      onAssetGenerated(asset);
    } catch (error) {
      console.error('Failed to generate background:', error);
      // Show user-friendly error message
      alert(`Failed to generate background: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Palette className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Background Generator</h2>
        <p className="text-lg text-gray-600">Create stunning backgrounds for your games</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Environment</label>
              <div className="grid grid-cols-1 gap-2">
                {environments.map(env => (
                  <button
                    key={env.id}
                    onClick={() => setSettings(prev => ({ ...prev, environment: env.id as any }))}
                    className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                      settings.environment === env.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{env.label}</div>
                    <div className="text-sm text-gray-600">{env.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {settings.environment === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                <textarea
                  value={settings.customPrompt}
                  onChange={(e) => setSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="Describe your custom environment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                <select
                  value={settings.mood}
                  onChange={(e) => setSettings(prev => ({ ...prev, mood: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {moods.map(mood => (
                    <option key={mood.id} value={mood.id}>{mood.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={settings.timeOfDay}
                  onChange={(e) => setSettings(prev => ({ ...prev, timeOfDay: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeOptions.map(time => (
                    <option key={time.id} value={time.id}>{time.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={generateBackground}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Background</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundGenerator;