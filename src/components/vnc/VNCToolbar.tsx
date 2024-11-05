import React from 'react';
import { Monitor, Power, Settings, RefreshCw } from 'lucide-react';

interface VNCToolbarProps {
  isConnected: boolean;
  onDisconnect: () => void;
  onReconnect: () => void;
  onToggleSettings: () => void;
}

const VNCToolbar: React.FC<VNCToolbarProps> = ({
  isConnected,
  onDisconnect,
  onReconnect,
  onToggleSettings,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2 text-white">
        <Monitor className="w-5 h-5" />
        <span className="text-sm font-medium">Remote Desktop</span>
        {isConnected && (
          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
            Connected
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isConnected && (
          <>
            <button
              onClick={onReconnect}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              title="Reconnect"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onDisconnect}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              title="Disconnect"
            >
              <Power className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={onToggleSettings}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VNCToolbar;