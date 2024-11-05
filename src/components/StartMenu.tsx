import React from 'react';
import { 
  FileText, 
  Table, 
  Mail, 
  Settings, 
  Power, 
  Chrome, 
  Search, 
  Pin, 
  FolderOpen,
  Users,
  MessageSquare,
  Bot,
  Youtube,
  Heart,
  Book,
  Monitor,
  Network,
  Display
} from 'lucide-react';

interface StartMenuProps {
  onAppClick: (app: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

const StartMenu: React.FC<StartMenuProps> = ({ onAppClick, onLogout, isMobile }) => {
  const pinnedApps = [
    { name: 'File Explorer', icon: FolderOpen },
    { name: 'Chrome', icon: Chrome },
    { name: 'Firefox', icon: Monitor },
    { name: 'Word', icon: FileText },
    { name: 'Excel', icon: Table },
    { name: 'AI Employees', icon: Users },
    { name: 'ChatGPT', icon: MessageSquare },
    { name: 'Gemini', icon: Bot },
    { name: 'YouTube', icon: Youtube },
    { name: 'Joi', icon: Heart },
    { name: 'Creative Writer', icon: Book },
    { name: 'Kasm', icon: Display }
  ];

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[640px] bg-black/70 backdrop-blur-xl rounded-lg p-6 border border-white/10 shadow-2xl">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Type to search"
          className="w-full bg-white/10 text-white pl-12 pr-4 py-2 rounded-lg outline-none focus:bg-white/20 transition-colors"
        />
      </div>

      {/* Pinned Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-sm font-medium">Pinned</h2>
          <button className="text-white/60 hover:text-white text-sm flex items-center gap-1">
            <Pin className="w-4 h-4" />
            All apps
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {pinnedApps.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => onAppClick(name)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-white/10">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs text-center">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500" />
          <span className="text-white text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAppClick('Settings')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Power className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;