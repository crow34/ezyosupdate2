import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Monitor, 
  Mail, 
  Chrome, 
  FolderOpen,
  Store,
  Users,
  Globe,
  Bot,
  MessageSquare,
  Youtube,
  Heart,
  Book,
  Network,
  Display
} from 'lucide-react';

// Base components loaded immediately
import TaskbarIcon from './components/TaskbarIcon';
import StartMenu from './components/StartMenu';
import Desktop from './components/Desktop';
import Window from './components/Window';
import Clock from './components/Clock';
import Login from './components/Login';

// Lazy loaded components
const WebBrowser = lazy(() => import('./components/Browser'));
const FirefoxBrowser = lazy(() => import('./components/apps/Firefox'));
const FileExplorer = lazy(() => import('./components/FileExplorer'));
const AppStore = lazy(() => import('./components/AppStore'));
const Settings = lazy(() => import('./components/Settings'));
const AIEmployeeManager = lazy(() => import('./components/AIEmployees/AIEmployeeManager'));
const ChatGPT = lazy(() => import('./components/apps/ChatGPT'));
const Gemini = lazy(() => import('./components/apps/Gemini'));
const YouTube = lazy(() => import('./components/apps/YouTube'));
const Word = lazy(() => import('./components/office/Word'));
const Excel = lazy(() => import('./components/office/Excel'));
const Joi = lazy(() => import('./components/apps/Joi'));
const CreativeWriter = lazy(() => import('./components/apps/CreativeWriter'));
const Intranet = lazy(() => import('./components/apps/Intranet'));
const KasmWorkspaces = lazy(() => import('./components/apps/KasmWorkspaces'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('wallpaper') || 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('wallpaper', wallpaper);
  }, [wallpaper]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setActiveWindows([]);
    setActiveWindow(null);
    setIsStartOpen(false);
  };

  const toggleStart = () => setIsStartOpen(!isStartOpen);

  const openWindow = (app: string) => {
    if (!activeWindows.includes(app)) {
      setActiveWindows(prev => [...prev, app]);
    }
    setActiveWindow(app);
    setIsStartOpen(false);
  };

  const closeWindow = (app: string) => {
    setActiveWindows(prev => prev.filter(w => w !== app));
    if (activeWindow === app) {
      setActiveWindow(null);
    }
  };

  const getWindowContent = (window: string) => (
    <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
      {(() => {
        switch (window) {
          case 'Chrome':
            return <WebBrowser />;
          case 'Firefox':
            return <FirefoxBrowser />;
          case 'File Explorer':
            return <FileExplorer />;
          case 'App Store':
            return <AppStore />;
          case 'Settings':
            return <Settings onLogout={handleLogout} onWallpaperChange={setWallpaper} />;
          case 'Word':
            return <Word />;
          case 'Excel':
            return <Excel />;
          case 'AI Employees':
            return <AIEmployeeManager />;
          case 'ChatGPT':
            return <ChatGPT />;
          case 'Gemini':
            return <Gemini />;
          case 'YouTube':
            return <YouTube />;
          case 'Joi':
            return <Joi />;
          case 'Creative Writer':
            return <CreativeWriter />;
          case 'Intranet':
            return <Intranet />;
          case 'Kasm':
            return <KasmWorkspaces />;
          default:
            return null;
        }
      })()}
    </Suspense>
  );

  const getWindowIcon = (window: string) => {
    switch (window) {
      case 'Chrome':
        return <Chrome className="h-5 w-5" />;
      case 'Firefox':
        return <Monitor className="h-5 w-5" />;
      case 'File Explorer':
        return <FolderOpen className="h-5 w-5" />;
      case 'Mail':
        return <Mail className="h-5 w-5" />;
      case 'AI Employees':
        return <Users className="h-5 w-5" />;
      case 'ChatGPT':
        return <MessageSquare className="h-5 w-5" />;
      case 'Gemini':
        return <Bot className="h-5 w-5" />;
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Joi':
        return <Heart className="h-5 w-5" />;
      case 'Creative Writer':
        return <Book className="h-5 w-5" />;
      case 'Intranet':
        return <Network className="h-5 w-5" />;
      case 'Kasm':
        return <Display className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Desktop onOpenWindow={openWindow} isMobile={isMobile} />

      {activeWindows.map(window => (
        <Window 
          key={window}
          title={window}
          icon={getWindowIcon(window)}
          isActive={activeWindow === window}
          onClose={() => closeWindow(window)}
          onClick={() => setActiveWindow(window)}
          isMobile={isMobile}
        >
          {getWindowContent(window)}
        </Window>
      ))}

      {isStartOpen && (
        <StartMenu onAppClick={openWindow} onLogout={handleLogout} isMobile={isMobile} />
      )}

      <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/70 backdrop-blur-lg border-t border-white/10 flex items-center px-3 z-50">
        <div className="flex-1 flex items-center gap-1">
          <TaskbarIcon
            icon={<Monitor className="h-5 w-5 text-white" />}
            isActive={isStartOpen}
            onClick={toggleStart}
          />
          {!isMobile && activeWindows.map(window => (
            <TaskbarIcon
              key={window}
              icon={getWindowIcon(window)}
              isActive={activeWindow === window}
              onClick={() => setActiveWindow(window)}
            />
          ))}
        </div>
        <Clock />
      </div>
    </div>
  );
}

export default App;