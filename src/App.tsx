import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { Feed } from './components/Feed';
import { UserProfile } from './components/UserProfile';
import { NewPromptModal } from './components/NewPromptModal';
import { MobileNav } from './components/MobileNav';
import { AuthModal } from './components/AuthModal';
import { AIPlayground } from './components/AIPlayground';
import { KanbanBoard } from './components/KanbanBoard';
import { AboutPage } from './components/AboutPage';
import { NewsPage } from './components/NewsPage';
import { ContactPage } from './components/ContactPage';
import { useAuthStore } from './store/authStore';

type View = 'home' | 'trending' | 'agents' | 'teams' | 'bookmarks' | 'profile' | 'search' | 'playground' | 'kanban' | 'about' | 'news' | 'contact';

function App() {
  const [activeNav, setActiveNav] = useState<View>('home');
  const [isNewPromptOpen, setIsNewPromptOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const handleNewPrompt = (data: any) => {
    console.log('New prompt:', data);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleNewPromptClick = () => {
    if (isAuthenticated) {
      setIsNewPromptOpen(true);
    } else {
      openAuth('login');
    }
  };

  const renderMainContent = () => {
    switch (activeNav) {
      case 'profile':
        return <UserProfile />;
      case 'playground':
        return <AIPlayground onOpenAuth={openAuth} />;
      case 'kanban':
        return <KanbanBoard />;
      case 'about':
        return <AboutPage />;
      case 'news':
        return <NewsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <Feed />;
    }
  };

  const showRightPanel = !['playground', 'kanban', 'about', 'news', 'contact'].includes(activeNav);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="min-h-screen bg-[var(--bg-page)] flex">
        <Sidebar
          activeNav={activeNav}
          onNavChange={(nav) => setActiveNav(nav as View)}
          onNewPrompt={handleNewPromptClick}
          onOpenAuth={openAuth}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <div className="flex-1 flex justify-center">
          <div className={`flex w-full ${activeNav === 'kanban' ? '' : 'max-w-[1400px]'}`}>
            {renderMainContent()}
            {showRightPanel && <RightPanel />}
          </div>
        </div>

        <MobileNav
          activeNav={activeNav}
          onNavChange={(nav) => setActiveNav(nav as View)}
          onNewPrompt={handleNewPromptClick}
          onOpenAuth={openAuth}
        />

        <NewPromptModal
          isOpen={isNewPromptOpen}
          onClose={() => setIsNewPromptOpen(false)}
          onSubmit={handleNewPrompt}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
        />
      </div>
    </>
  );
}

export default App;
