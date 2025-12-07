import React from 'react';
import { mockAgents, mockUsers } from '../data/mockData';
import { Avatar } from './ui/Avatar';
import { SearchIcon, TrendingIcon, UsersIcon, StarIcon } from './icons';

export function RightPanel() {
  const topAgents = mockAgents.slice(0, 3);
  const topCreators = mockUsers
    .sort((a, b) => b.credibilityScore - a.credibilityScore)
    .slice(0, 4);

  return (
    <aside
      className="hidden xl:flex w-72 2xl:w-80 h-screen sticky top-0 flex-col bg-[var(--bg-surface-1)] border-l border-[var(--border-default)] overflow-y-auto"
      role="complementary"
      aria-label="Sidebar"
    >
      <div className="p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Search prompts and agents</label>
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            id="search-input"
            type="search"
            placeholder="Search\u2026"
            autoComplete="off"
            className="w-full h-10 pl-9 pr-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] transition-colors"
          />
        </div>

        {/* Trending Agents */}
        <section aria-labelledby="popular-agents-heading">
          <header className="flex items-center gap-2 mb-3">
            <TrendingIcon size={16} className="text-[var(--primary-500)]" />
            <h2 id="popular-agents-heading" className="font-semibold text-sm text-[var(--text-primary)]">Popular Agents</h2>
          </header>
          <div className="space-y-2">
            {topAgents.map((agent) => (
              <button
                key={agent.id}
                className="flex items-center gap-3 w-full p-2.5 bg-[var(--bg-surface-2)] rounded-md border border-[var(--border-default)] hover:border-[var(--border-interactive)] transition-colors text-left"
                aria-label={`View ${agent.name} agent`}
              >
                <Avatar src={agent.avatar} alt="" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate">{agent.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">by @{agent.creator.handle}</p>
                </div>
                <div className="flex items-center gap-1 text-[var(--primary-500)]">
                  <StarIcon size={12} />
                  <span className="font-mono text-xs tabular-nums">{agent.performanceRating}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Top Creators */}
        <section aria-labelledby="top-creators-heading">
          <header className="flex items-center gap-2 mb-3">
            <UsersIcon size={16} className="text-[var(--primary-500)]" />
            <h2 id="top-creators-heading" className="font-semibold text-sm text-[var(--text-primary)]">Top Creators</h2>
          </header>
          <div className="space-y-1">
            {topCreators.map((user, index) => (
              <button
                key={user.id}
                className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[var(--bg-surface-2)] transition-colors text-left"
                aria-label={`View ${user.name}'s profile`}
              >
                <div className="relative">
                  <Avatar src={user.avatar} alt="" size="sm" />
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-full flex items-center justify-center text-[10px] font-mono text-[var(--text-secondary)]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">@{user.handle}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-[var(--primary-500)] tabular-nums">{user.credibilityScore}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-default)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Platform</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="font-mono text-base text-[var(--text-primary)] tabular-nums">12.4k</p>
              <p className="text-xs text-[var(--text-secondary)]">Prompts</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-base text-[var(--text-primary)] tabular-nums">1.2k</p>
              <p className="text-xs text-[var(--text-secondary)]">Agents</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
