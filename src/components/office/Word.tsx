import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Save } from 'lucide-react';

const Word: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b">
        <div className="flex items-center gap-2 p-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Save className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <AlignRight className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-8 focus:outline-none"
            placeholder="Start typing..."
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-100 text-gray-600 text-sm flex items-center justify-between">
        <div>Words: {content.split(/\s+/).filter(Boolean).length}</div>
        <div>Characters: {content.length}</div>
      </div>
    </div>
  );
};

export default Word;