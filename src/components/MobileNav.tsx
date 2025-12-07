import React from 'react';
import { HomeIcon, PlaygroundIcon, BotIcon, UserIcon, PlusIcon } from './icons';
import { useAuthStore } from '../store/authStore';

interface MobileNavProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onNewPrompt: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isCenter?: boolean;
}

function NavButton({ icon, label, active, onClick, isCenter }: NavButtonProps) {
  if (isCenter) {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        className="flex items-center justify-center -mt-4"
      >
        <span className="w-12 h-12 rounded-full bg-[var(--primary-500)] flex items-center justify-center shadow-lg text-white">
          {icon}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-colors ${
        active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
      }`}
    >
      <span>{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export function MobileNav({ activeNav, onNavChange, onNewPrompt, onOpenAuth }: MobileNavProps) {
  const { isAuthenticated } = useAuthStore();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      onNavChange('profile');
    } else {
      onOpenAuth('login');
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[var(--bg-surface-1)]/95 backdrop-blur-md border-t border-[var(--border-default)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 4px)' }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-end justify-around h-14">
        <NavButton
          icon={<HomeIcon size={20} />}
          label="Home"
          active={activeNav === 'home'}
          onClick={() => onNavChange('home')}
        />
        <NavButton
          icon={<PlaygroundIcon size={20} />}
          label="Playground"
          active={activeNav === 'playground'}
          onClick={() => onNavChange('playground')}
        />
        <NavButton
          icon={<PlusIcon size={22} />}
          label="New"
          onClick={onNewPrompt}
          isCenter
        />
        <NavButton
          icon={<BotIcon size={20} />}
          label="Agents"
          active={activeNav === 'agents'}
          onClick={() => onNavChange('agents')}
        />
        <NavButton
          icon={<UserIcon size={20} />}
          label={isAuthenticated ? 'Profile' : 'Sign in'}
          active={activeNav === 'profile'}
          onClick={handleProfileClick}
        />
      </div>
    </nav>
  );
}
