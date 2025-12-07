import React from 'react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';
import {
  HomeIcon,
  TrendingIcon,
  BotIcon,
  BookmarkIcon,
  UserIcon,
  PlusIcon,
  SettingsIcon,
  LogOutIcon,
  PlaygroundIcon,
  UsersIcon,
  BlocksIcon,
  InfoIcon,
  NewsIcon,
  MailIcon
} from './icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: number;
}

function NavItem({ icon, label, active = false, onClick, collapsed = false, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      className={`
        flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left
        transition-all duration-200 relative group
        ${active
          ? 'bg-gradient-to-r from-[var(--primary-500)]/20 to-[var(--primary-500)]/5 text-[var(--primary-400)] border border-[var(--primary-500)]/30'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] border border-transparent'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <span className={`flex-shrink-0 ${active ? 'text-[var(--primary-400)]' : ''}`}>{icon}</span>
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
      {badge && badge > 0 && (
        <span className={`
          ${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}
          min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--primary-500)] text-white text-xs font-bold flex items-center justify-center
        `}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// Collapse toggle icon
function ChevronIcon({ collapsed, size = 18 }: { collapsed: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onNewPrompt: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeNav, onNavChange, onNewPrompt, onOpenAuth, collapsed, onToggleCollapse }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <aside
      className={`
        hidden lg:flex h-screen sticky top-0 flex-col
        bg-[var(--bg-surface-1)]/80 backdrop-blur-xl
        border-r border-[var(--border-default)]
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-60 xl:w-64'}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo & Collapse Button */}
      <div className={`p-4 border-b border-[var(--border-default)] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <h1 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white text-xs font-bold">S</span>
            <span className="ml-1"><span className="text-[var(--primary-500)]">Sub</span>Prompter</span>
          </h1>
        )}
        {collapsed && (
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white text-sm font-bold shadow-lg">S</span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`
            p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-2)] transition-colors
            ${collapsed ? 'absolute right-2 top-4' : ''}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon collapsed={collapsed} size={16} />
        </button>
      </div>

      {/* New Prompt Button */}
      <div className="p-3">
        {collapsed ? (
          <button
            onClick={onNewPrompt}
            className="w-full aspect-square rounded-xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
            title="New Prompt"
          >
            <PlusIcon size={20} />
          </button>
        ) : (
          <Button variant="primary" className="w-full justify-center gap-2 rounded-xl shadow-lg" onClick={onNewPrompt}>
            <PlusIcon size={16} />
            <span>New Prompt</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        <NavItem
          icon={<HomeIcon size={18} />}
          label="Home"
          active={activeNav === 'home'}
          onClick={() => onNavChange('home')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<TrendingIcon size={18} />}
          label="Trending"
          active={activeNav === 'trending'}
          onClick={() => onNavChange('trending')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<BlocksIcon size={18} />}
          label="Kanban"
          active={activeNav === 'kanban'}
          onClick={() => onNavChange('kanban')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<BotIcon size={18} />}
          label="Agents"
          active={activeNav === 'agents'}
          onClick={() => onNavChange('agents')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<UsersIcon size={18} />}
          label="Teams"
          active={activeNav === 'teams'}
          onClick={() => onNavChange('teams')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<PlaygroundIcon size={18} />}
          label="Playground"
          active={activeNav === 'playground'}
          onClick={() => onNavChange('playground')}
          collapsed={collapsed}
        />

        <div className={`my-3 border-t border-[var(--border-default)] ${collapsed ? 'mx-1' : ''}`} />

        <NavItem
          icon={<InfoIcon size={18} />}
          label="About"
          active={activeNav === 'about'}
          onClick={() => onNavChange('about')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<NewsIcon size={18} />}
          label="News"
          active={activeNav === 'news'}
          onClick={() => onNavChange('news')}
          collapsed={collapsed}
        />
        <NavItem
          icon={<MailIcon size={18} />}
          label="Contact"
          active={activeNav === 'contact'}
          onClick={() => onNavChange('contact')}
          collapsed={collapsed}
        />
        {isAuthenticated && (
          <>
            <div className={`my-3 border-t border-[var(--border-default)] ${collapsed ? 'mx-1' : ''}`} />
            <NavItem
              icon={<BookmarkIcon size={18} />}
              label="Bookmarks"
              active={activeNav === 'bookmarks'}
              onClick={() => onNavChange('bookmarks')}
              collapsed={collapsed}
            />
            <NavItem
              icon={<UserIcon size={18} />}
              label="Profile"
              active={activeNav === 'profile'}
              onClick={() => onNavChange('profile')}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* User Section / Auth Buttons */}
      <div className="p-3 border-t border-[var(--border-default)]">
        {isAuthenticated && user ? (
          <div className="space-y-2">
            {collapsed ? (
              <>
                <button
                  className="w-full aspect-square rounded-xl flex items-center justify-center hover:bg-[var(--bg-surface-2)] transition-colors"
                  onClick={() => onNavChange('profile')}
                  title={user.name}
                >
                  <Avatar src={user.avatar} alt="" size="sm" />
                </button>
                <button
                  onClick={logout}
                  className="w-full aspect-square rounded-xl flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-surface-2)] hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOutIcon size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors text-left"
                  onClick={() => onNavChange('profile')}
                  aria-label={`${user.name}'s account menu`}
                >
                  <Avatar src={user.avatar} alt="" size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">@{user.handle}</p>
                  </div>
                  <SettingsIcon size={16} className="text-[var(--text-tertiary)] flex-shrink-0" />
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <LogOutIcon size={16} />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {collapsed ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full aspect-square rounded-xl bg-[var(--primary-500)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Sign in"
              >
                <UserIcon size={18} />
              </button>
            ) : (
              <>
                <Button
                  variant="primary"
                  className="w-full justify-center rounded-xl"
                  onClick={() => onOpenAuth('login')}
                >
                  Sign in
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center rounded-xl"
                  onClick={() => onOpenAuth('register')}
                >
                  Create account
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
