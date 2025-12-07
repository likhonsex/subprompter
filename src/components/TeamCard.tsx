import React from 'react';
import { Team } from '../store/dataStore';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { UsersIcon } from './icons';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { joinTeam } = useDataStore();

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated && user) {
      await joinTeam(team.id, user.id);
    }
  };

  return (
    <article className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-lg p-4 sm:p-5 transition-colors hover:bg-[var(--bg-surface-2)]">
      {/* Header */}
      <header className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {team.avatar ? (
            <img src={team.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <UsersIcon size={24} className="text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">{team.name}</h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>{team.memberCount} members</span>
            <span className="text-[var(--text-tertiary)]">\u00b7</span>
            <span>{team.promptCount} prompts</span>
          </div>
        </div>
      </header>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
        {team.description || 'A collaborative team building great prompts together.'}
      </p>

      {/* Members Preview */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {team.members.slice(0, 4).map((member) => (
            <Avatar
              key={member.id}
              src={member.avatar}
              alt={member.name}
              size="sm"
              className="ring-2 ring-[var(--bg-surface-1)]"
            />
          ))}
          {team.memberCount > 4 && (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-2)] border-2 border-[var(--bg-surface-1)] flex items-center justify-center text-xs text-[var(--text-secondary)] font-medium">
              +{team.memberCount - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          {team.members.slice(0, 2).map(m => m.name).join(', ')}
          {team.members.length > 2 && ` and ${team.memberCount - 2} others`}
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <Badge variant="default">Collaborative</Badge>
        <Badge variant="primary">Open</Badge>
      </div>

      {/* Actions */}
      <footer className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={handleJoin}
        >
          Join Team
        </Button>
        <Button variant="secondary" size="sm">
          View
        </Button>
      </footer>
    </article>
  );
}
