import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle, ExternalLink, Zap } from 'lucide-react';

interface ApiKeySetupProps {
  onKeysConfigured: () => void;
  onSkip?: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeysConfigured, onSkip }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [stabilityKey, setStabilityKey] = useState('');
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    // Check if API keys are already configured
    const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
    const hasGemini = !!import.meta.env.VITE_GEMINI_API_KEY;
    const hasStability = !!import.meta.env.VITE_STABILITY_API_KEY;
    
    if (hasOpenAI || hasGemini || hasStability) {
      onKeysConfigured();
    }
  }, [onKeysConfigured]);

  const handleSaveKeys = () => {
    if (openaiKey || geminiKey || stabilityKey) {
      // In a real app, you'd save these securely
      // For now, we'll just show instructions
      alert('API keys would be saved securely. For this demo, please add them to your .env file and restart the development server.');
    }
  };

  if (!showSetup) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Key className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup AI Image Generation</h1>
          <p className="text-gray-600">Configure your API keys to start generating game assets with multiple AI services</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Multi-Service Support</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Configure multiple AI services for better reliability and quality. The system will automatically try services in order of preference.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OpenAI DALL-E */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">OpenAI DALL-E</h3>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
                >
                  <span>Get Key</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Highest quality images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fast generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Best for detailed art</span>
                </div>
              </div>
            </div>

            {/* Google Gemini */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Google Gemini</h3>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
                >
                  <span>Get Key</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Smart prompt enhancement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Creative variations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Text enhancement only*</span>
                </div>
              </div>
            </div>

            {/* Stability AI */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Stability AI</h3>
                <a
                  href="https://platform.stability.ai/account/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
                >
                  <span>Get Key</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <input
                type="password"
                placeholder="sk-..."
                value={stabilityKey}
                onChange={(e) => setStabilityKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Stable Diffusion XL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cost effective</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Reliable fallback</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Setup Instructions</h3>
                <div className="text-sm text-yellow-700 mt-1 space-y-2">
                  <p>1. Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root</p>
                  <p>2. Add your API key(s) (you only need one, but more is better for reliability):</p>
                  <div className="bg-yellow-100 p-3 rounded mt-2 font-mono text-xs">
                    VITE_OPENAI_API_KEY=your_openai_key_here<br/>
                    VITE_GEMINI_API_KEY=your_gemini_key_here<br/>
                    VITE_STABILITY_API_KEY=your_stability_key_here
                  </div>
                  <p>3. Restart the development server</p>
                  <p className="text-xs mt-2">* Gemini currently enhances prompts for better results with other services</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSaveKeys}
              disabled={!openaiKey && !geminiKey && !stabilityKey}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Setup Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;