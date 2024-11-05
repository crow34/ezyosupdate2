import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ConnectionDetails {
  host: string;
  port: number;
  password?: string;
}

interface VNCConnectionFormProps {
  isConnecting: boolean;
  error: string | null;
  onConnect: (details: ConnectionDetails) => void;
  initialValues: ConnectionDetails;
}

const VNCConnectionForm: React.FC<VNCConnectionFormProps> = ({
  isConnecting,
  error,
  onConnect,
  initialValues,
}) => {
  const [details, setDetails] = useState<ConnectionDetails>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(details);
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Connect to Remote Desktop</h2>
          <p className="text-gray-400">Enter the connection details below</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Host
            </label>
            <input
              type="text"
              value={details.host}
              onChange={(e) => setDetails({ ...details, host: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="localhost or IP address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Port
            </label>
            <input
              type="number"
              value={details.port}
              onChange={(e) => setDetails({ ...details, port: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="5900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password (optional)
            </label>
            <input
              type="password"
              value={details.password || ''}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
      </form>
    </div>
  );
};

export default VNCConnectionForm;