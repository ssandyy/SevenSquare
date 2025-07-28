import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Trash2, 
  Download,
  HardDrive, 
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { ImageStorage } from '../../utils/imageStorage';

const StorageManager = () => {
  const [storageInfo, setStorageInfo] = useState({
    count: 0,
    totalSize: 0,
    totalSizeMB: 0
  });
  const [images, setImages] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = () => {
    const info = ImageStorage.getStorageUsage();
    const allImages = ImageStorage.getAllImages();
    setStorageInfo(info);
    setImages(allImages);
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`)) {
      selectedImages.forEach(productId => {
        ImageStorage.deleteImage(productId);
      });
      setSelectedImages([]);
      loadStorageInfo();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL images? This action cannot be undone.')) {
      ImageStorage.clearAllImages();
      setSelectedImages([]);
      loadStorageInfo();
    }
  };

  const toggleImageSelection = (productId) => {
    setSelectedImages(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStorageStatus = () => {
    const { totalSizeMB } = storageInfo;
    if (totalSizeMB > 50) return { status: 'critical', color: 'red', icon: AlertTriangle };
    if (totalSizeMB > 25) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
    return { status: 'good', color: 'green', icon: CheckCircle };
  };

  const storageStatus = getStorageStatus();
  const StatusIcon = storageStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storage Manager</h1>
          <p className="text-gray-600">Manage product images stored in localStorage</p>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">{storageInfo.count}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{storageInfo.totalSizeMB} MB</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Status</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{storageStatus.status}</p>
            </div>
            <div className={`p-3 bg-${storageStatus.color}-100 rounded-lg`}>
              <StatusIcon className={`w-6 h-6 text-${storageStatus.color}-600`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">{selectedImages.length}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Database className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Storage Actions</h2>
          <div className="flex space-x-3">
            {selectedImages.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedImages.length})
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-4 py-2 bg-red-800 text-white text-sm font-medium rounded-lg hover:bg-red-900 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Images
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stored Images</h3>
        </div>
        <div className="p-6">
          {Object.keys(images).length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images stored</h3>
              <p className="text-gray-600">Upload images in the Products section to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(images).map(([productId, imageData]) => (
                <div 
                  key={productId} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedImages.includes(productId) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleImageSelection(productId)}
                >
                  <div className="relative">
                    <img 
                      src={imageData.data} 
                      alt={`Product ${productId}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {selectedImages.includes(productId) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-900">Product ID: {productId}</p>
                    <p className="text-xs text-gray-500">
                      Size: {Math.round(imageData.data.length * 0.75 / 1024)} KB
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(imageData.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Storage Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Storage Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Images are automatically compressed to save space</li>
          <li>• Maximum file size: 5MB per image</li>
          <li>• Supported formats: JPEG, PNG, WebP</li>
          <li>• Images are stored locally in your browser</li>
          <li>• Clearing browser data will remove all images</li>
          <li>• Consider backing up important images</li>
        </ul>
      </div>
    </div>
  );
};

export default StorageManager; 