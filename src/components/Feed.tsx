import React, { useState, useEffect, useMemo } from 'react';
import { Prompt, Agent, FeedType } from '../types';
import { useDataStore, Team } from '../store/dataStore';
import { PromptCard } from './PromptCard';
import { AgentCard } from './AgentCard';
import { TeamCard } from './TeamCard';
import { Tabs } from './ui/Tabs';
import { TrendingIcon, SparklesIcon, BotIcon, ForkIcon, UsersIcon, PinIcon } from './icons';
import { Badge } from './ui/Badge';

type ExtendedFeedType = FeedType | 'teams' | 'pinned';

const feedTabs = [
  { id: 'trending', label: 'Trending', icon: <TrendingIcon size={14} /> },
  { id: 'new', label: 'New', icon: <SparklesIcon size={14} /> },
  { id: 'pinned', label: 'Pinned', icon: <PinIcon size={14} /> },
  { id: 'agents', label: 'Agents', icon: <BotIcon size={14} /> },
  { id: 'teams', label: 'Teams', icon: <UsersIcon size={14} /> },
  { id: 'forked', label: 'Forked', icon: <ForkIcon size={14} /> },
];

// Helper to check if a date is within last N days
const isWithinDays = (dateStr: string, days: number): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

// Get trending score (engagement-based)
const getTrendingScore = (prompt: Prompt): number => {
  const recencyBonus = isWithinDays(prompt.createdAt, 3) ? 500 : isWithinDays(prompt.createdAt, 7) ? 200 : 0;
  return (
    prompt.ratingScore * 100 +
    prompt.forkCount * 3 +
    prompt.commentCount * 2 +
    prompt.bookmarkCount +
    recencyBonus
  );
};

export function Feed() {
  const [activeTab, setActiveTab] = useState<ExtendedFeedType>('trending');

  const {
    prompts: dbPrompts,
    agents: dbAgents,
    teams: dbTeams,
    pinnedPrompts,
    isLoading,
    isInitialized,
    initialize,
  } = useDataStore();

  // Initialize database on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Memoized filtered/sorted content
  const { prompts, agents, teams, stats } = useMemo(() => {
    const allPrompts = [...dbPrompts];
    const allAgents = [...dbAgents];
    const allTeams = [...dbTeams];

    // Calculate stats
    const newPromptsCount = allPrompts.filter(p => isWithinDays(p.createdAt, 3)).length;
    const forkedPromptsCount = allPrompts.filter(p => p.forkedFrom).length;
    const pinnedCount = pinnedPrompts.length;

    let filteredPrompts: Prompt[] = [];
    let filteredAgents: Agent[] = [];
    let filteredTeams: Team[] = [];

    switch (activeTab) {
      case 'trending':
        // Sort by trending score (engagement + recency)
        filteredPrompts = allPrompts.sort((a, b) => getTrendingScore(b) - getTrendingScore(a));
        break;
      case 'new':
        // Only show prompts from last 7 days, sorted by newest first
        filteredPrompts = allPrompts
          .filter(p => isWithinDays(p.createdAt, 7))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'pinned':
        // Show pinned prompts
        filteredPrompts = pinnedPrompts;
        break;
      case 'agents':
        // Sort agents by usage and rating
        filteredAgents = allAgents.sort((a, b) => {
          const scoreA = a.performanceRating * 1000 + a.usageCount + a.followers;
          const scoreB = b.performanceRating * 1000 + b.usageCount + b.followers;
          return scoreB - scoreA;
        });
        break;
      case 'teams':
        // Sort teams by member count
        filteredTeams = allTeams.sort((a, b) => b.memberCount - a.memberCount);
        break;
      case 'forked':
        // Only show forked prompts, sorted by rating
        filteredPrompts = allPrompts
          .filter(p => p.forkedFrom)
          .sort((a, b) => b.ratingScore - a.ratingScore);
        break;
      default:
        filteredPrompts = allPrompts;
    }

    return {
      prompts: filteredPrompts,
      agents: filteredAgents,
      teams: filteredTeams,
      stats: { newPromptsCount, forkedPromptsCount, pinnedCount, totalAgents: allAgents.length, totalTeams: allTeams.length },
    };
  }, [activeTab, dbPrompts, dbAgents, dbTeams, pinnedPrompts]);

  // Tab header with context
  const getTabHeader = () => {
    switch (activeTab) {
      case 'trending':
        return {
          title: 'Trending Prompts',
          subtitle: 'Most engaging prompts based on ratings, forks, and activity',
        };
      case 'new':
        return {
          title: 'New Prompts',
          subtitle: `${stats.newPromptsCount} prompts added recently`,
        };
      case 'pinned':
        return {
          title: 'Pinned Prompts',
          subtitle: `${stats.pinnedCount} featured community favorites`,
        };
      case 'agents':
        return {
          title: 'AI Agents',
          subtitle: `${stats.totalAgents} agents built from community prompts`,
        };
      case 'teams':
        return {
          title: 'Teams',
          subtitle: `${stats.totalTeams} collaborative teams`,
        };
      case 'forked':
        return {
          title: 'Forked Prompts',
          subtitle: `${stats.forkedPromptsCount} community improvements and variations`,
        };
      default:
        return { title: 'Feed', subtitle: '' };
    }
  };

  const header = getTabHeader();

  // Loading state
  if (isLoading && !isInitialized) {
    return (
      <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading prompts...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 min-h-screen lg:border-x border-[var(--border-default)]"
      id="main-content"
    >
      {/* Header - Sticky with backdrop blur */}
      <header className="sticky top-0 z-20 bg-[var(--bg-page)]/80 backdrop-blur-md border-b border-[var(--border-default)]">
        {/* Mobile header */}
        <div className="lg:hidden px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-[var(--text-primary)]">
            <span className="text-[var(--primary-500)]">Sub</span>Prompter
          </h1>
        </div>
        {/* Desktop header */}
        <div className="hidden lg:flex px-5 py-3 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">{header.title}</h1>
            <p className="text-xs text-[var(--text-secondary)]">{header.subtitle}</p>
          </div>
        </div>
        <Tabs
          tabs={feedTabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as ExtendedFeedType)}
        />
      </header>

      {/* Content with proper spacing for mobile nav */}
      <div className="p-3 sm:p-4 lg:p-5 pb-20 lg:pb-5">
        {activeTab === 'agents' ? (
          <>
            {/* Agents Grid */}
            {agents.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
                {agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AgentCard agent={agent} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No agents yet. Create the first one!" />
            )}
          </>
        ) : activeTab === 'teams' ? (
          <>
            {/* Teams Grid */}
            {teams.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TeamCard team={team} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No teams yet. Start a new team!" />
            )}
          </>
        ) : (
          <>
            {/* Prompts List */}
            {prompts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {prompts.map((prompt, index) => (
                  <div
                    key={prompt.id}
                    className="animate-fade-in relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Visual indicators based on tab */}
                    {activeTab === 'new' && isWithinDays(prompt.createdAt, 1) && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge variant="primary" size="sm">Today</Badge>
                      </div>
                    )}
                    {activeTab === 'trending' && index < 3 && (
                      <div className="absolute -top-1 -left-1 z-10">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                    )}
                    {activeTab === 'pinned' && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge variant="warning" size="sm">Pinned</Badge>
                      </div>
                    )}
                    {activeTab === 'forked' && prompt.forkedFrom && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge variant="success" size="sm">Fork</Badge>
                      </div>
                    )}
                    <PromptCard prompt={prompt} showForkedFrom={activeTab === 'forked'} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message={
                  activeTab === 'new'
                    ? 'No new prompts in the last 7 days'
                    : activeTab === 'forked'
                    ? 'No forked prompts yet'
                    : activeTab === 'pinned'
                    ? 'No pinned prompts yet'
                    : 'No prompts yet. Create the first one!'
                }
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center">
        <SparklesIcon size={24} className="text-[var(--text-tertiary)]" />
      </div>
      <p className="text-[var(--text-secondary)] text-sm">{message}</p>
    </div>
  );
}
