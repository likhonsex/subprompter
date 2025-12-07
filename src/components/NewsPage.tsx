import React, { useState } from 'react';
import { Badge } from './ui/Badge';
import { SparklesIcon, BotIcon, ZapIcon, StarIcon } from './icons';

interface Announcement {
  id: string;
  type: 'feature' | 'update' | 'event' | 'announcement';
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
}

const announcements: Announcement[] = [
  { id: '1', type: 'feature', title: 'Introducing Codestral AI Completion', summary: 'Write prompts faster with AI-powered code completion.', content: 'We\'re excited to announce Codestral integration...', date: '2024-12-06', tags: ['AI', 'Codestral', 'New Feature'] },
  { id: '2', type: 'feature', title: 'Kanban Board for Prompt Management', summary: 'Organize prompts with drag-and-drop Kanban boards.', content: 'We\'ve added a new Kanban view...', date: '2024-12-05', tags: ['Productivity', 'Teams'] },
  { id: '3', type: 'update', title: 'Database Migration Complete', summary: 'SubPrompter now powered by Neon PostgreSQL.', content: 'Migration complete with improved performance...', date: '2024-12-04', tags: ['Infrastructure'] },
  { id: '4', type: 'announcement', title: 'Community Milestone: 10,000 Prompts!', summary: 'Thanks to our amazing community!', content: 'We hit 10,000 shared prompts...', date: '2024-12-03', tags: ['Community', 'Milestone'] },
  { id: '5', type: 'event', title: 'Prompt Engineering Workshop - Dec 15', summary: 'Join us for a free online workshop.', content: 'Advanced prompt techniques workshop...', date: '2024-12-02', tags: ['Event', 'Workshop'] },
];

const typeIcons = { feature: SparklesIcon, update: ZapIcon, event: StarIcon, announcement: BotIcon };
const typeColors = { feature: 'primary', update: 'warning', event: 'success', announcement: 'default' } as const;

export function NewsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredAnnouncements = filter === 'all' ? announcements : announcements.filter(a => a.type === filter);

  return (
    <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)]" id="main-content">
      <header className="sticky top-0 z-20 bg-[var(--bg-page)]/80 backdrop-blur-xl border-b border-[var(--border-default)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">News & Announcements</h1>
            <p className="text-sm text-[var(--text-secondary)]">Stay updated with the latest from SubPrompter</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'feature', 'update', 'event', 'announcement'].map((type) => (
            <button key={type} onClick={() => setFilter(type)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === type ? 'bg-[var(--primary-500)] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)]'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 pb-20 lg:pb-6">
        {selectedAnnouncement ? (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedAnnouncement(null)} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-500)] mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Back to all news
            </button>
            <article className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
              <Badge variant={typeColors[selectedAnnouncement.type]} className="mb-4">{selectedAnnouncement.type}</Badge>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{selectedAnnouncement.title}</h1>
              <p className="text-[var(--text-secondary)]">{selectedAnnouncement.content}</p>
            </article>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredAnnouncements.map((announcement) => {
              const Icon = typeIcons[announcement.type];
              return (
                <article key={announcement.id} onClick={() => setSelectedAnnouncement(announcement)} className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-xl p-5 cursor-pointer hover:border-[var(--primary-500)]/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={typeColors[announcement.type]} size="sm">{announcement.type}</Badge>
                        <span className="text-xs text-[var(--text-tertiary)]">{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      <h2 className="font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">{announcement.title}</h2>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{announcement.summary}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
