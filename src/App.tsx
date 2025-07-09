import React, { useState } from 'react';
import { GeneratedAsset } from './types';
import Dashboard from './components/Dashboard';
import ApiKeySetup from './components/ApiKeySetup';

function App() {
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [showApiSetup, setShowApiSetup] = useState(false);

  const handleAssetGenerated = (asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleShowApiSetup = () => {
    setShowApiSetup(true);
  };

  const handleHideApiSetup = () => {
    setShowApiSetup(false);
  };

  if (showApiSetup) {
    return <ApiKeySetup onKeysConfigured={handleHideApiSetup} onSkip={handleHideApiSetup} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        assets={assets}
        onAssetGenerated={handleAssetGenerated}
        onDeleteAsset={handleDeleteAsset}
        onShowApiSetup={handleShowApiSetup}
      />
    </div>
  );
}

export default App;