import React from 'react';
import { 
  FileText, 
  Table, 
  Mail, 
  Chrome, 
  FolderOpen, 
  Store, 
  Settings, 
  Users, 
  Bot, 
  MessageSquare, 
  Youtube, 
  Heart, 
  Book,
  Monitor,
  Network,
  Display
} from 'lucide-react';

interface DesktopProps {
  onOpenWindow: (app: string) => void;
  isMobile?: boolean;
}

const Desktop: React.FC<DesktopProps> = ({ onOpenWindow, isMobile }) => {
  const apps = [
    { name: 'File Explorer', icon: FolderOpen },
    { name: 'Chrome', icon: Chrome },
    { name: 'Firefox', icon: Monitor },
    { name: 'Word', icon: FileText },
    { name: 'Excel', icon: Table },
    { name: 'Intranet', icon: Network },
    { name: 'AI Employees', icon: Users },
    { name: 'ChatGPT', icon: MessageSquare },
    { name: 'Gemini', icon: Bot },
    { name: 'YouTube', icon: Youtube },
    { name: 'Joi', icon: Heart },
    { name: 'Creative Writer', icon: Book },
    { name: 'Kasm', icon: Display }
  ];

  return (
    <div className="absolute top-0 left-0 right-0 bottom-12 p-4 overflow-auto">
      <div className="grid grid-cols-auto-fit gap-4">
        {apps.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onOpenWindow(name)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 group relative"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-xl group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300 shadow-lg">
              <Icon className="w-6 h-6 text-white/90 drop-shadow-md" />
            </div>
            <span className="text-white text-xs text-center px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-2 whitespace-nowrap">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Desktop;