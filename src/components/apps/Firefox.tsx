import React, { useState } from 'react';
import { Globe, Plus, X, ChevronLeft, ChevronRight, RotateCcw, History } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
}

const Firefox: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'https://web.archive.org/' }
  ]);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [inputUrl, setInputUrl] = useState<string>('https://web.archive.org/');

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://web.archive.org/'
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setInputUrl('https://web.archive.org/');
  };

  const removeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (newTabs.length === 0) {
      addTab();
    } else if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
      setInputUrl(newTabs[0].url);
    }
    setTabs(newTabs);
  };

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      const waybackUrl = `https://web.archive.org/web/${inputUrl}`;
      const newTabs = tabs.map(tab =>
        tab.id === activeTab ? { ...tab, url: waybackUrl } : tab
      );
      setTabs(newTabs);
    }
  };

  const getCurrentTab = () => tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#1c1b22] px-2">
        <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setInputUrl(tab.url);
              }}
              className={`flex items-center gap-2 px-4 py-2 max-w-[200px] ${
                activeTab === tab.id
                  ? 'bg-[#2b2a33] text-white'
                  : 'text-gray-300 hover:bg-[#2b2a33]'
              } rounded-t-lg cursor-pointer group`}
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm">{tab.title}</span>
              <button
                onClick={(e) => removeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 p-1 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className="p-2 text-gray-300 hover:bg-[#2b2a33] rounded-full ml-2"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1c1b22]">
        <button className="p-1.5 text-gray-300 hover:bg-[#2b2a33] rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-gray-300 hover:bg-[#2b2a33] rounded-full">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-gray-300 hover:bg-[#2b2a33] rounded-full">
          <RotateCcw className="w-4 h-4" />
        </button>
        <form onSubmit={navigate} className="flex-1 flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full px-4 py-1.5 bg-[#2b2a33] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setInputUrl(`https://web.archive.org/web/${inputUrl}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
              title="View in Wayback Machine"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white">
        {getCurrentTab() && (
          <iframe
            src={getCurrentTab()?.url}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default Firefox;