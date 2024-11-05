import React, { useState } from 'react';
import { Download, Search, Star, ExternalLink, Plus, Upload, X } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  rating: number;
  installed: boolean;
  developer?: string;
  category?: string;
  price?: string;
}

const AppStore: React.FC = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [apps, setApps] = useState<App[]>([
    {
      id: '1',
      name: 'VS Code Web',
      description: 'Code editing. Redefined.',
      icon: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop',
      rating: 4.8,
      installed: false,
      developer: 'Microsoft',
      category: 'Development',
      price: 'Free'
    },
    {
      id: '2',
      name: 'Figma Web',
      description: 'Design and prototype together',
      icon: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=64&h=64&fit=crop',
      rating: 4.9,
      installed: false,
      developer: 'Figma',
      category: 'Design',
      price: 'Free'
    },
    {
      id: '3',
      name: 'Spotify Web',
      description: 'Music for everyone',
      icon: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=64&h=64&fit=crop',
      rating: 4.7,
      installed: true,
      developer: 'Spotify',
      category: 'Entertainment',
      price: 'Free'
    }
  ]);

  const [newApp, setNewApp] = useState<Partial<App>>({
    name: '',
    description: '',
    icon: '',
    developer: '',
    category: '',
    price: 'Free'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Development', 'Design', 'Entertainment', 'Productivity', 'Games'];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApp.name && newApp.description && newApp.icon) {
      const app: App = {
        id: Date.now().toString(),
        name: newApp.name,
        description: newApp.description,
        icon: newApp.icon,
        rating: 0,
        installed: false,
        developer: newApp.developer,
        category: newApp.category,
        price: newApp.price || 'Free'
      };
      setApps([...apps, app]);
      setNewApp({
        name: '',
        description: '',
        icon: '',
        developer: '',
        category: '',
        price: 'Free'
      });
      setShowSubmitForm(false);
    }
  };

  const toggleInstall = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, installed: !app.installed } : app
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">App Store</h1>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit App
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* App List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {filteredApps.map(app => (
            <div key={app.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{app.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{app.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{app.developer}</span>
                        <span>{app.category}</span>
                        <span>{app.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{app.rating.toFixed(1)}</span>
                      </div>
                      <button
                        onClick={() => toggleInstall(app.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          app.installed
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {app.installed ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Install
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit App Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Submit New App</h2>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={newApp.name}
                    onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newApp.description}
                    onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon URL
                  </label>
                  <input
                    type="url"
                    value={newApp.icon}
                    onChange={(e) => setNewApp({ ...newApp, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Developer
                  </label>
                  <input
                    type="text"
                    value={newApp.developer}
                    onChange={(e) => setNewApp({ ...newApp, developer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newApp.category}
                    onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <select
                    value={newApp.price}
                    onChange={(e) => setNewApp({ ...newApp, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Free">Free</option>
                    <option value="$0.99">$0.99</option>
                    <option value="$1.99">$1.99</option>
                    <option value="$4.99">$4.99</option>
                    <option value="$9.99">$9.99</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppStore;