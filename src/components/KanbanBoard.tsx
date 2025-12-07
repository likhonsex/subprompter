import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { useDataStore } from '../store/dataStore';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { StarIcon, ForkIcon, MessageIcon, PlusIcon } from './icons';

type KanbanStatus = 'draft' | 'review' | 'published' | 'featured';

interface KanbanCard {
  prompt: Prompt;
  status: KanbanStatus;
}

const columns: { id: KanbanStatus; title: string; color: string; bgColor: string }[] = [
  { id: 'draft', title: 'Draft', color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
  { id: 'review', title: 'In Review', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { id: 'published', title: 'Published', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { id: 'featured', title: 'Featured', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
];

// Assign status based on prompt properties
function getPromptStatus(prompt: Prompt): KanbanStatus {
  if (prompt.ratingScore >= 4.7 && prompt.forkCount >= 50) return 'featured';
  if (prompt.ratingScore >= 4.0) return 'published';
  if (prompt.commentCount > 0 || prompt.forkCount > 0) return 'review';
  return 'draft';
}

export function KanbanBoard() {
  const { prompts, isLoading, initialize, isInitialized } = useDataStore();
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const kanbanCards = prompts.map(prompt => ({
      prompt,
      status: getPromptStatus(prompt),
    }));
    setCards(kanbanCards);
  }, [prompts]);

  const getCardsForColumn = (status: KanbanStatus) => {
    return cards.filter(card => card.status === status);
  };

  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: KanbanStatus) => {
    e.preventDefault();
    if (draggedCard && draggedCard.status !== targetStatus) {
      setCards(prev =>
        prev.map(card =>
          card.prompt.id === draggedCard.prompt.id
            ? { ...card, status: targetStatus }
            : card
        )
      );
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  if (isLoading && !isInitialized) {
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen overflow-hidden" id="main-content">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg-page)]/80 backdrop-blur-xl border-b border-[var(--border-default)] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Kanban Board</h1>
            <p className="text-sm text-[var(--text-secondary)]">Drag prompts between stages to track progress</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-tertiary)]">{prompts.length} prompts</span>
          </div>
        </div>
      </header>

      {/* Board */}
      <div className="p-4 sm:p-6 pb-20 lg:pb-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {columns.map(column => {
            const columnCards = getCardsForColumn(column.id);
            const isOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={`
                  w-72 sm:w-80 flex-shrink-0 rounded-2xl
                  bg-[var(--bg-surface-1)]/50 backdrop-blur-sm
                  border border-[var(--border-default)]
                  transition-all duration-200
                  ${isOver ? 'ring-2 ring-[var(--primary-500)] border-[var(--primary-500)]' : ''}
                `}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-[var(--border-default)] ${column.bgColor} rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${column.color.replace('text-', 'bg-')}`} />
                      <h2 className={`font-semibold ${column.color}`}>{column.title}</h2>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
                      {columnCards.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto">
                  {columnCards.map(card => (
                    <KanbanCardComponent
                      key={card.prompt.id}
                      card={card}
                      onDragStart={handleDragStart}
                      isDragging={draggedCard?.prompt.id === card.prompt.id}
                    />
                  ))}

                  {columnCards.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-[var(--text-tertiary)]">No prompts</p>
                    </div>
                  )}

                  {/* Add Card Button */}
                  <button className="w-full py-2 rounded-xl border border-dashed border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--text-tertiary)] transition-colors flex items-center justify-center gap-2">
                    <PlusIcon size={14} />
                    <span className="text-sm">Add prompt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

interface KanbanCardProps {
  card: KanbanCard;
  onDragStart: (e: React.DragEvent, card: KanbanCard) => void;
  isDragging: boolean;
}

function KanbanCardComponent({ card, onDragStart, isDragging }: KanbanCardProps) {
  const { prompt } = card;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      className={`
        bg-[var(--bg-surface-2)] rounded-xl p-4 cursor-grab active:cursor-grabbing
        border border-[var(--border-default)] hover:border-[var(--primary-500)]/50
        transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      {/* Tags */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {prompt.tags.slice(0, 2).map(tag => (
          <Badge key={tag} variant="default" size="sm">{tag}</Badge>
        ))}
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm text-[var(--text-primary)] mb-2 line-clamp-2">
        {prompt.title}
      </h3>

      {/* Content Preview */}
      <p className="text-xs text-[var(--text-tertiary)] mb-3 line-clamp-2">
        {prompt.content.slice(0, 80)}...
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <Avatar src={prompt.author.avatar} alt="" size="xs" />
          <span className="text-xs text-[var(--text-secondary)]">@{prompt.author.handle}</span>
        </div>
        <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
          <div className="flex items-center gap-1">
            <StarIcon size={12} filled className="text-yellow-500" />
            <span className="text-xs font-mono">{prompt.ratingScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ForkIcon size={12} />
            <span className="text-xs font-mono">{prompt.forkCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
