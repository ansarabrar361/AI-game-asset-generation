import React, { useState } from 'react';
import { Download, Trash2, Eye, Tag, Calendar, Palette, User, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { GeneratedAsset } from '../types';
import { aiImageGenerator } from '../services/aiImageGenerator';

interface GeneratedAssetCardProps {
  asset: GeneratedAsset;
  viewMode: 'grid' | 'list';
  onDownload: (asset: GeneratedAsset) => void;
  onDelete: (id: string) => void;
}

const GeneratedAssetCard: React.FC<GeneratedAssetCardProps> = ({
  asset,
  viewMode,
  onDownload,
  onDelete
}) => {
  const [showVariations, setShowVariations] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = () => {
    return asset.type === 'background' ? Palette : User;
  };

  const getTypeColor = () => {
    return asset.type === 'background' ? 'blue' : 'green';
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await aiImageGenerator.exportAsset(asset, 'png');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export asset. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPackage = async () => {
    setIsExporting(true);
    try {
      await aiImageGenerator.exportAsset(asset, 'zip');
    } catch (error) {
      console.error('Export package failed:', error);
      alert('Failed to export asset package. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {React.createElement(getTypeIcon(), {
                className: `h-5 w-5 text-${getTypeColor()}-500`
              })}
              <h3 className="text-lg font-semibold text-gray-900 truncate">{asset.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getTypeColor()}-100 text-${getTypeColor()}-800`}>
                {asset.type}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{asset.prompt}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(asset.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{asset.style}</span>
              </div>
              {asset.variations && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{asset.variations.length} variations</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors duration-200"
              title="Download main image"
            >
              <Download className="h-5 w-5" />
            </button>
            {asset.variations && asset.variations.length > 0 && (
              <button
                onClick={handleDownloadPackage}
                disabled={isExporting}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors duration-200"
                title="Download complete package with variations"
              >
                <Package className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => onDelete(asset.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getTypeColor()}-100 text-${getTypeColor()}-800`}>
            {asset.type}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="p-2 bg-white/80 hover:bg-white text-gray-600 disabled:opacity-50 rounded-lg transition-colors duration-200"
            title="Download main image"
          >
            <Download className="h-4 w-4" />
          </button>
          {asset.variations && asset.variations.length > 0 && (
            <button
              onClick={handleDownloadPackage}
              disabled={isExporting}
              className="p-2 bg-white/80 hover:bg-white text-gray-600 disabled:opacity-50 rounded-lg transition-colors duration-200"
              title="Download complete package"
            >
              <Package className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(asset.id)}
            className="p-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          {React.createElement(getTypeIcon(), {
            className: `h-5 w-5 text-${getTypeColor()}-500`
          })}
          <h3 className="text-lg font-semibold text-gray-900 truncate">{asset.name}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{asset.prompt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(asset.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span>{asset.style}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {asset.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {asset.variations && asset.variations.length > 0 && (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowVariations(!showVariations)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>Variations ({asset.variations.length})</span>
              {showVariations ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {showVariations && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {asset.variations.map(variation => (
                  <div key={variation.id} className="text-center">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={variation.imageUrl}
                        alt={variation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-600">{variation.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedAssetCard;