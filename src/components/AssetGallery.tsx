import React, { useState } from 'react';
import { Image, Grid3X3, List, Search, Filter, Download, Package } from 'lucide-react';
import { GeneratedAsset } from '../types';
import GeneratedAssetCard from './GeneratedAssetCard';
import { aiImageGenerator } from '../services/aiImageGenerator';

interface AssetGalleryProps {
  assets: GeneratedAsset[];
  onDeleteAsset: (id: string) => void;
}

const AssetGallery: React.FC<AssetGalleryProps> = ({ assets, onDeleteAsset }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'background' | 'character'>('all');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesStyle = filterStyle === 'all' || asset.style === filterStyle;
    
    return matchesSearch && matchesType && matchesStyle;
  });

  const uniqueStyles = [...new Set(assets.map(asset => asset.style))];

  const bulkDownload = async () => {
    if (filteredAssets.length === 0) {
      alert('No assets to export');
      return;
    }
    
    setIsExporting(true);
    try {
      await aiImageGenerator.exportMultipleAssets(filteredAssets);
    } catch (error) {
      console.error('Bulk export failed:', error);
      alert('Failed to export assets. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image className="h-8 w-8 text-purple-500" />
          <h2 className="text-3xl font-bold text-gray-900">Asset Gallery</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={bulkDownload}
            disabled={isExporting || filteredAssets.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <Package className="h-4 w-4 animate-pulse" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                <span>Export All ({filteredAssets.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="background">Backgrounds</option>
              <option value="character">Characters</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Styles</option>
              {uniqueStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredAssets.length} of {assets.length} assets
          </div>
        </div>
      </div>

      {/* Assets Grid/List */}
      {filteredAssets.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAssets.map(asset => (
            <GeneratedAssetCard
              key={asset.id}
              asset={asset}
              viewMode={viewMode}
              onDelete={onDeleteAsset}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterStyle !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start generating assets to see them here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AssetGallery;