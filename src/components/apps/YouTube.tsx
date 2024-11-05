import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const YouTube: React.FC = () => {
  const [url, setUrl] = useState('https://www.youtube.com/embed/featured');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setUrl(`https://www.youtube.com/embed/results?search_query=${encodeURIComponent(searchTerm)}`);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f]">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search YouTube..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 bg-black">
        <iframe
          src={url}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YouTube;