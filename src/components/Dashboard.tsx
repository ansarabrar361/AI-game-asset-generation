import React, { useState } from 'react';
import { Palette, User, Image, Sparkles, Download, Grid3X3, Settings } from 'lucide-react';
import { GeneratedAsset } from '../types';
import BackgroundGenerator from './BackgroundGenerator';
import CharacterGenerator from './CharacterGenerator';
import AssetGallery from './AssetGallery';
import { aiImageGenerator } from '../services/aiImageGenerator';

interface DashboardProps {
  assets: GeneratedAsset[];
  onAssetGenerated: (asset: GeneratedAsset) => void;
  onDeleteAsset: (id: string) => void;
  onShowApiSetup: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, onAssetGenerated, onDeleteAsset, onShowApiSetup }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'backgrounds' | 'characters' | 'gallery'>('overview');

  const backgroundCount = assets.filter(asset => asset.type === 'background').length;
  const characterCount = assets.filter(asset => asset.type === 'character').length;
  const availableServices = aiImageGenerator.getAvailableServices();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Grid3X3 },
    { id: 'backgrounds', label: 'Backgrounds', icon: Palette },
    { id: 'characters', label: 'Characters', icon: User },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'backgrounds':
        return <BackgroundGenerator onAssetGenerated={onAssetGenerated} />;
      case 'characters':
        return <CharacterGenerator onAssetGenerated={onAssetGenerated} />;
      case 'gallery':
        return <AssetGallery assets={assets} onDeleteAsset={onDeleteAsset} />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <Sparkles className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Asset Generator</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create stunning game assets with AI-powered generation. Generate backgrounds, characters, and complete sprite sets for your games.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Palette className="h-8 w-8 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">{backgroundCount}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backgrounds</h3>
                <p className="text-gray-600">Generated environments and scenes</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <User className="h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">{characterCount}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Characters</h3>
                <p className="text-gray-600">Characters with sprite variations</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Image className="h-8 w-8 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900">{assets.length}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Assets</h3>
                <p className="text-gray-600">All generated assets</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Download className="h-8 w-8 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {assets.reduce((sum, asset) => sum + (asset.variations?.length || 0) + 1, 0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Files</h3>
                <p className="text-gray-600">Including variations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Backgrounds</h3>
                <p className="text-gray-700 mb-6">Create immersive environments for your games with various styles and moods.</p>
                <button
                  onClick={() => setActiveTab('backgrounds')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Start Creating
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Characters</h3>
                <p className="text-gray-700 mb-6">Create characters with complete sprite sets including animations and states.</p>
                <button
                  onClick={() => setActiveTab('characters')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Game Asset Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {availableServices.length > 0 ? (
                  <span className="text-green-600">✓ {availableServices.length} AI service(s) configured</span>
                ) : (
                  <span className="text-red-600">⚠ No API keys configured</span>
                )}
              </div>
              <button
                onClick={onShowApiSetup}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>API Setup</span>
              </button>
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;