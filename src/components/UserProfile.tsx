import React, { useState } from 'react';
import { User } from '../types';
import { mockPrompts, mockAgents } from '../data/mockData';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tabs } from './ui/Tabs';
import { PromptCard } from './PromptCard';
import { AgentCard } from './AgentCard';
import { useAuthStore } from '../store/authStore';
import { LogOutIcon } from './icons';

const profileTabs = [
  { id: 'prompts', label: 'Prompts' },
  { id: 'agents', label: 'Agents' },
  { id: 'forks', label: 'Forks' },
  { id: 'bookmarks', label: 'Bookmarks' },
];

interface UserProfileProps {
  user?: User;
}

export function UserProfile({ user: propUser }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('prompts');
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: authUser, isAuthenticated, logout } = useAuthStore();

  // Use auth user if no prop user, convert AuthUser to User type
  const displayUser: User | null = propUser || (authUser ? {
    id: authUser.id,
    name: authUser.name,
    handle: authUser.handle,
    avatar: authUser.avatar,
    bio: authUser.bio || 'No bio yet. Edit your profile to add one!',
    credibilityScore: authUser.credibilityScore,
    followers: authUser.followerCount,
    following: authUser.followingCount,
    createdPrompts: 0,
    createdAgents: 0,
    joinedAt: authUser.createdAt
  } : null);

  if (!displayUser) {
    return (
      <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-[var(--text-secondary)]">Please sign in to view your profile</p>
        </div>
      </main>
    );
  }

  const isOwnProfile = authUser?.id === displayUser.id;
  const userPrompts = mockPrompts.filter(p => p.author.id === displayUser.id);
  const userAgents = mockAgents.filter(a => a.creator.id === displayUser.id);

  const getCredibilityLevel = (score: number) => {
    if (score >= 95) return { label: 'Elite', variant: 'success' as const };
    if (score >= 85) return { label: 'Expert', variant: 'primary' as const };
    if (score >= 70) return { label: 'Trusted', variant: 'warning' as const };
    return { label: 'Rising', variant: 'default' as const };
  };

  const credLevel = getCredibilityLevel(displayUser.credibilityScore);

  return (
    <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] pb-20 lg:pb-0">
      {/* Cover */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-500)]" />

      {/* Profile Header */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12">
          <Avatar
            src={displayUser.avatar}
            alt={displayUser.name}
            size="xl"
            className="ring-4 ring-[var(--bg-page)] w-20 h-20 sm:w-24 sm:h-24"
          />
          <div className="flex-1 sm:pt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{displayUser.name}</h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)]">@{displayUser.handle}</p>
              </div>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="secondary" size="sm">Edit Profile</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOutIcon size={16} />
                      <span className="hidden sm:inline ml-1">Sign out</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={isFollowing ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm sm:text-base text-[var(--text-primary)]">{displayUser.bio}</p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Badge variant={credLevel.variant}>{credLevel.label}</Badge>
            <span className="font-mono text-base sm:text-lg text-[var(--primary-500)]">{displayUser.credibilityScore}</span>
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Trust</span>
          </div>
          <div className="text-sm">
            <span className="font-mono text-[var(--text-primary)]">{displayUser.followers.toLocaleString()}</span>
            <span className="text-[var(--text-secondary)] ml-1">followers</span>
          </div>
          <div className="text-sm">
            <span className="font-mono text-[var(--text-primary)]">{displayUser.following.toLocaleString()}</span>
            <span className="text-[var(--text-secondary)] ml-1">following</span>
          </div>
        </div>

        {/* Contribution Stats */}
        <div className="grid grid-cols-4 gap-2 sm:gap-6 mt-4 pt-4 border-t border-[var(--border-default)]">
          <div className="text-center">
            <p className="font-mono text-lg sm:text-xl text-[var(--text-primary)]">{displayUser.createdPrompts}</p>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Prompts</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg sm:text-xl text-[var(--text-primary)]">{displayUser.createdAgents}</p>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Agents</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg sm:text-xl text-[var(--text-primary)]">
              {userPrompts.reduce((sum, p) => sum + p.forkCount, 0)}
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Forks</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg sm:text-xl text-[var(--text-primary)]">
              {userAgents.reduce((sum, a) => sum + a.usageCount, 0).toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Uses</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {activeTab === 'prompts' && (
          <div className="space-y-4">
            {userPrompts.length > 0 ? (
              userPrompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))
            ) : (
              <EmptyState message="No prompts yet. Create your first prompt!" />
            )}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-4">
            {userAgents.length > 0 ? (
              userAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))
            ) : (
              <EmptyState message="No agents yet. Build your first agent!" />
            )}
          </div>
        )}

        {activeTab === 'forks' && (
          <EmptyState message="Forked prompts will appear here" />
        )}

        {activeTab === 'bookmarks' && (
          <EmptyState message="Bookmarked prompts will appear here" />
        )}
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
