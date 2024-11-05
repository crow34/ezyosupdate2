import React, { useState } from 'react';
import { Globe, Plus, X } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  url: string;
}

const RemoteDesktop: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('novnc-connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [newConnection, setNewConnection] = useState({ name: '', url: '' });

  const saveConnection = () => {
    if (newConnection.name && newConnection.url) {
      const connection: Connection = {
        id: Date.now().toString(),
        name: newConnection.name,
        url: newConnection.url
      };
      const updatedConnections = [...connections, connection];
      setConnections(updatedConnections);
      localStorage.setItem('novnc-connections', JSON.stringify(updatedConnections));
      setNewConnection({ name: '', url: '' });
      setShowAddForm(false);
    }
  };

  const deleteConnection = (id: string) => {
    const updatedConnections = connections.filter(conn => conn.id !== id);
    setConnections(updatedConnections);
    localStorage.setItem('novnc-connections', JSON.stringify(updatedConnections));
    if (selectedConnection?.id === id) {
      setSelectedConnection(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Remote Desktop</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Add Connection
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {connections.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No connections added yet. Click "Add Connection" to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map(connection => (
              <div key={connection.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{connection.name}</h3>
                  <button
                    onClick={() => deleteConnection(connection.id)}
                    className="p-1 hover:bg-red-50 text-red-500 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 truncate mb-4">{connection.url}</p>
                <button
                  onClick={() => window.open(connection.url, '_blank')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Connection Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Connection</h2>
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
                    Connection Name
                  </label>
                  <input
                    type="text"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="My Remote Desktop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    noVNC URL
                  </label>
                  <input
                    type="url"
                    value={newConnection.url}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://example.com/vnc.html"
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
                  onClick={saveConnection}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteDesktop;