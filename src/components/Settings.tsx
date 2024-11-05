import React, { useState } from 'react';
import { Image, Monitor, Sun, Key } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onWallpaperChange: (url: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, onWallpaperChange }) => {
  const [activeTab, setActiveTab] = useState<'display' | 'api'>('display');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [apiKeys, setApiKeys] = useState({
    openai_key: localStorage.getItem('openai_key') || '',
    gemini_key: localStorage.getItem('gemini_key') || '',
    groq_key: localStorage.getItem('groq_key') || ''
  });

  const handleWallpaperChange = (url: string) => {
    if (url) {
      onWallpaperChange(url);
      localStorage.setItem('wallpaper', url);
    }
  };

  const handleCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWallpaperUrl) {
      handleWallpaperChange(customWallpaperUrl);
      setCustomWallpaperUrl('');
    }
  };

  const saveApiKeys = () => {
    Object.entries(apiKeys).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-medium mb-4">Settings</h2>
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('display')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeTab === 'display' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Monitor className="w-5 h-5" />
            Display
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeTab === 'api' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Key className="w-5 h-5" />
            API Keys
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl">
          {activeTab === 'display' && (
            <section>
              <h1 className="text-2xl font-semibold mb-6">Display Settings</h1>

              {/* Custom Wallpaper */}
              <div className="mb-8">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5" />
                  Custom Wallpaper
                </h3>
                <form onSubmit={handleCustomWallpaper} className="flex gap-2">
                  <input
                    type="url"
                    value={customWallpaperUrl}
                    onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                    placeholder="Enter wallpaper URL"
                    className="flex-1 px-3 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Brightness */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Brightness
                  </h3>
                  <span className="text-sm text-gray-600">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </section>
          )}

          {activeTab === 'api' && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">API Keys</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.openai_key}
                    onChange={(e) => setApiKeys({ ...apiKeys, openai_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="sk-..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.gemini_key}
                    onChange={(e) => setApiKeys({ ...apiKeys, gemini_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="AIza..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groq API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.groq_key}
                    onChange={(e) => setApiKeys({ ...apiKeys, groq_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="gsk_..."
                  />
                </div>
                <button
                  onClick={saveApiKeys}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save API Keys
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;