import React, { useState, useEffect } from 'react';
import { Globe, Plus, X, Settings, ExternalLink, Loader2 } from 'lucide-react';

interface KasmServer {
  id: string;
  name: string;
  url: string;
  added: Date;
}

const KasmWorkspaces: React.FC = () => {
  const [servers, setServers] = useState<KasmServer[]>(() => {
    const saved = localStorage.getItem('kasm_servers');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newServer, setNewServer] = useState({ name: '', url: '' });
  const [selectedServer, setSelectedServer] = useState<KasmServer | null>(null);

  useEffect(() => {
    localStorage.setItem('kasm_servers', JSON.stringify(servers));
  }, [servers]);

  const addServer = () => {
    if (!newServer.name || !newServer.url) return;

    const server: KasmServer = {
      id: Date.now().toString(),
      name: newServer.name,
      url: newServer.url.endsWith('/') ? newServer.url : `${newServer.url}/`,
      added: new Date()
    };

    setServers(prev => [...prev, server]);
    setNewServer({ name: '', url: '' });
    setShowAddForm(false);
  };

  const removeServer = (id: string) => {
    setServers(prev => prev.filter(server => server.id !== id));
    if (selectedServer?.id === id) {
      setSelectedServer(null);
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Kasm Workspaces</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {servers.map(server => (
            <div
              key={server.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{server.name}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => window.open(server.url, '_blank')}
                    className="p-1 hover:bg-gray-200 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeServer(server.id)}
                    className="p-1 hover:bg-red-100 text-red-500 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">{server.url}</p>
              <p className="text-xs text-gray-400 mt-1">
                Added: {new Date(server.added).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {servers.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No Kasm servers added yet. Click the + button to add one.
          </div>
        ) : selectedServer ? (
          <iframe
            src={selectedServer.url}
            className="w-full h-full border rounded-lg"
            title={selectedServer.name}
          />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select a server from the sidebar to view it.
          </div>
        )}
      </div>

      {/* Add Server Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Kasm Server</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Server Name
                  </label>
                  <input
                    type="text"
                    value={newServer.name}
                    onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="My Kasm Server"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Server URL
                  </label>
                  <input
                    type="url"
                    value={newServer.url}
                    onChange={(e) => setNewServer(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://kasm.example.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addServer}
                  disabled={!newServer.name || !newServer.url}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Add Server
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KasmWorkspaces;