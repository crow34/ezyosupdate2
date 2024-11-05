import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'admin';
    
    // Check against default credentials first
    if (username === defaultUsername && password === defaultPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
      return;
    }

    // Check against stored credentials if they exist
    const storedPassword = localStorage.getItem('admin_password');
    if (storedPassword && username === 'admin' && password === storedPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
      return;
    }

    // Show error if credentials don't match
    setError('Invalid username or password');
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1707343843437-caacff5cfa74)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Default credentials: admin / admin
        </div>
      </div>
    </div>
  );
};

export default Login;