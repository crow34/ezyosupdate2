import React, { useEffect, useRef, useState } from 'react';
import { Monitor, Power, Settings, RefreshCw } from 'lucide-react';
import VNCToolbar from './VNCToolbar';
import VNCConnectionForm from './VNCConnectionForm';
import VNCDisplay from './VNCDisplay';

interface VNCViewerProps {
  onClose?: () => void;
}

interface ConnectionDetails {
  host: string;
  port: number;
  password?: string;
}

const VNCViewer: React.FC<VNCViewerProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>({
    host: 'localhost',
    port: 5900,
  });

  const handleConnect = async (details: ConnectionDetails) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnectionDetails(details);
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect to remote desktop');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleReconnect = () => {
    handleConnect(connectionDetails);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <VNCToolbar
        isConnected={isConnected}
        onDisconnect={handleDisconnect}
        onReconnect={handleReconnect}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex-1 relative">
        {!isConnected ? (
          <VNCConnectionForm
            isConnecting={isConnecting}
            error={error}
            onConnect={handleConnect}
            initialValues={connectionDetails}
          />
        ) : (
          <VNCDisplay connectionDetails={connectionDetails} />
        )}
      </div>

      {showSettings && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">VNC Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Depth
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="24">24-bit</option>
                  <option value="16">16-bit</option>
                  <option value="8">8-bit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compression
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="0">Auto</option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">View only mode</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Shared session</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VNCViewer;