import React, { useState } from 'react';
import { Agent } from '../types';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { UsersIcon, ZapIcon, StarIcon } from './icons';

interface AgentCardProps {
  agent: Agent;
  onFollow?: (agent: Agent) => void;
  onClick?: (agent: Agent) => void;
}

export function AgentCard({ agent, onFollow, onClick }: AgentCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <article
      className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-lg p-4 sm:p-5 transition-colors hover:bg-[var(--bg-surface-2)] cursor-pointer"
      onClick={() => onClick?.(agent)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(agent)}
    >
      {/* Header */}
      <header className="flex items-start gap-3 sm:gap-4 mb-3">
        <Avatar src={agent.avatar} alt="" size="lg" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] truncate">{agent.name}</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                by @{agent.creator.handle}
              </p>
            </div>
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowing(!isFollowing);
                onFollow?.(agent);
              }}
              aria-pressed={isFollowing}
              className="flex-shrink-0"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </header>

      {/* Description */}
      <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
        {agent.description}
      </p>

      {/* Tags - Scrollable */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {agent.tags.map((tag) => (
          <Badge key={tag} variant="default" className="flex-shrink-0">{tag}</Badge>
        ))}
      </div>

      {/* Stats */}
      <footer className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-[var(--border-default)] text-sm">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <StarIcon size={14} className="text-[var(--primary-500)]" />
          <span className="font-mono tabular-nums">{agent.performanceRating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <ZapIcon size={14} />
          <span className="font-mono tabular-nums">{formatNumber(agent.usageCount)}</span>
          <span className="hidden xs:inline">uses</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <UsersIcon size={14} />
          <span className="font-mono tabular-nums">{formatNumber(agent.followers)}</span>
        </div>
      </footer>
    </article>
  );
}
