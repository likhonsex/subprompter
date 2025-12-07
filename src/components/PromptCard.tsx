import React, { useState } from 'react';
import { Prompt } from '../types';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import {
  ForkIcon,
  MessageIcon,
  BookmarkIcon,
  CheckIcon,
  RecycleIcon,
  BlocksIcon,
  BotIcon
} from './icons';

interface PromptCardProps {
  prompt: Prompt;
  onFork?: (prompt: Prompt) => void;
  onBookmark?: (prompt: Prompt) => void;
  onClick?: (prompt: Prompt) => void;
  showForkedFrom?: boolean;
}

export function PromptCard({ prompt, onFork, onBookmark, onClick, showForkedFrom }: PromptCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showRatings, setShowRatings] = useState(false);

  const totalRatings = Object.values(prompt.ratingSignals).reduce((a, b) => a + b, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1d';
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}w`;
    return `${Math.floor(days / 30)}mo`;
  };

  return (
    <article
      className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-lg p-4 sm:p-5 transition-colors hover:bg-[var(--bg-surface-2)] cursor-pointer"
      onClick={() => onClick?.(prompt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(prompt)}
    >
      {/* Header */}
      <header className="flex items-start gap-3 mb-3">
        <Avatar src={prompt.author.avatar} alt="" size="sm" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-sm text-[var(--text-primary)]">{prompt.author.name}</span>
            <span className="text-sm text-[var(--text-secondary)] hidden xs:inline">@{prompt.author.handle}</span>
            <span className="text-[var(--text-tertiary)]">\u00b7</span>
            <span className="text-sm text-[var(--text-secondary)]">{formatTimeAgo(prompt.createdAt)}</span>
          </div>
          <span className="text-xs text-[var(--text-tertiary)] font-mono tabular-nums">
            Trust: {prompt.author.credibilityScore}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[var(--primary-500)] flex-shrink-0">
          <StarIcon filled className="w-4 h-4" />
          <span className="font-mono text-sm tabular-nums">{prompt.ratingScore.toFixed(1)}</span>
        </div>
      </header>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
        {prompt.title}
      </h3>

      {/* Forked From Indicator */}
      {showForkedFrom && prompt.forkedFrom && (
        <div className="flex items-center gap-1.5 mb-2 text-xs text-[var(--text-secondary)]">
          <ForkIcon size={12} />
          <span>Forked from original prompt</span>
          <span className="text-[var(--primary-500)] font-medium">#{prompt.forkedFrom}</span>
        </div>
      )}

      {/* Content Preview - Responsive height */}
      <div className="bg-[var(--bg-page)] rounded-md p-3 mb-3 font-mono text-xs sm:text-sm text-[var(--text-secondary)] max-h-24 sm:max-h-28 overflow-hidden relative">
        <pre className="whitespace-pre-wrap break-words">{prompt.content.slice(0, 200)}\u2026</pre>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--bg-page)] to-transparent" aria-hidden="true" />
      </div>

      {/* Tags - Scrollable on mobile */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {prompt.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="default" className="flex-shrink-0">{tag}</Badge>
        ))}
        {prompt.techniquesUsed.slice(0, 2).map((technique) => (
          <Badge key={technique} variant="primary" className="flex-shrink-0">{technique}</Badge>
        ))}
      </div>

      {/* Model Targets - Hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2 mb-3 text-xs text-[var(--text-secondary)]">
        <span>Works with:</span>
        {prompt.modelTargets.slice(0, 3).map((model) => (
          <span key={model} className="px-1.5 py-0.5 bg-[var(--bg-surface-2)] rounded text-[var(--text-tertiary)] border border-[var(--border-default)]">
            {model}
          </span>
        ))}
      </div>

      {/* Actions - Touch-friendly */}
      <footer className="flex items-center gap-2 sm:gap-4 pt-3 border-t border-[var(--border-default)]">
        {/* Rating Button */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowRatings(!showRatings); }}
            className="flex items-center gap-1.5 px-2 py-1.5 -ml-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--bg-surface-2)] transition-colors"
            aria-label={`Rate prompt. ${formatNumber(totalRatings)} ratings`}
            aria-expanded={showRatings}
          >
            <CheckIcon size={16} />
            <span className="font-mono text-xs tabular-nums">{formatNumber(totalRatings)}</span>
          </button>

          {/* Rating Popup */}
          {showRatings && (
            <div
              className="absolute bottom-full left-0 mb-2 p-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg shadow-layered z-30 min-w-[180px] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Rate this prompt"
            >
              <div className="text-xs font-semibold text-[var(--text-primary)] mb-2">Rate this prompt</div>
              <div className="space-y-1">
                <RatingButton icon={<CheckIcon size={14} />} label="Works as claimed" count={prompt.ratingSignals.worksAsClaimed} />
                <RatingButton icon={<RecycleIcon size={14} />} label="Reusable" count={prompt.ratingSignals.reusable} />
                <RatingButton icon={<BlocksIcon size={14} />} label="Structured" count={prompt.ratingSignals.structured} />
                <RatingButton icon={<BotIcon size={14} />} label="Agent-ready" count={prompt.ratingSignals.agentReady} />
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--bg-surface-2)] transition-colors"
          aria-label={`${prompt.commentCount} comments`}
        >
          <MessageIcon size={16} />
          <span className="font-mono text-xs tabular-nums">{prompt.commentCount}</span>
        </button>

        {/* Fork */}
        <button
          onClick={(e) => { e.stopPropagation(); onFork?.(prompt); }}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--bg-surface-2)] transition-colors"
          aria-label={`Fork prompt. ${formatNumber(prompt.forkCount)} forks`}
        >
          <ForkIcon size={16} />
          <span className="font-mono text-xs tabular-nums">{formatNumber(prompt.forkCount)}</span>
        </button>

        {/* Bookmark - Push to right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
            onBookmark?.(prompt);
          }}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md ml-auto transition-colors ${
            isBookmarked
              ? 'text-[var(--primary-500)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--bg-surface-2)]'
          }`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark prompt'}
          aria-pressed={isBookmarked}
        >
          <BookmarkIcon size={16} filled={isBookmarked} />
          <span className="font-mono text-xs tabular-nums hidden sm:inline">{formatNumber(prompt.bookmarkCount)}</span>
        </button>
      </footer>
    </article>
  );
}

function RatingButton({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  const [voted, setVoted] = useState(false);

  return (
    <button
      onClick={() => setVoted(!voted)}
      className={`flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition-colors ${
        voted
          ? 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]'
          : 'hover:bg-[var(--bg-surface-3)] text-[var(--text-secondary)]'
      }`}
      aria-pressed={voted}
    >
      {icon}
      <span className="flex-1 text-left text-xs">{label}</span>
      <span className="font-mono text-xs tabular-nums">{count + (voted ? 1 : 0)}</span>
    </button>
  );
}

function StarIcon({ filled = false, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
