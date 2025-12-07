import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CodeCompletionTextarea } from './ui/CodeCompletionTextarea';
import { isCodestralConfigured } from '../services/codestral';
import { ZapIcon } from './icons';

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromptFormData) => void;
}

interface PromptFormData {
  title: string;
  content: string;
  tags: string[];
  techniques: string[];
  models: string[];
}

const availableTechniques = ['CoT', 'Role', 'Few-Shot', 'RAG', 'JSON Mode', 'Self-Verification', 'Structured Output'];
const availableModels = ['GPT-4', 'Claude', 'Gemini', 'Llama', 'Mistral'];
const suggestedTags = ['coding', 'reasoning', 'creative', 'research', 'automation', 'security', 'documentation'];

export function NewPromptModal({ isOpen, onClose, onSubmit }: NewPromptModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [enableAI, setEnableAI] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus trap and autofocus
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // Small delay to let animation start
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleArrayItem = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, tags, techniques, models });
    setTitle('');
    setContent('');
    setTags([]);
    setTechniques([]);
    setModels([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Full screen on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-xl md:max-w-2xl sm:mx-4 max-h-[100dvh] sm:max-h-[85vh] overflow-hidden bg-[var(--bg-surface-1)] sm:rounded-lg border-t sm:border border-[var(--border-default)] shadow-layered animate-slide-up sm:animate-scale-in">
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[100dvh] sm:max-h-[85vh]">
          {/* Header - Sticky */}
          <header className="flex items-center justify-between p-3 sm:p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface-1)] flex-shrink-0">
            <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">New Prompt</h2>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!title.trim() || !content.trim()}>
                Publish
              </Button>
            </div>
          </header>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="prompt-title" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Title
              </label>
              <input
                ref={titleInputRef}
                id="prompt-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your prompt a descriptive title…"
                autoComplete="off"
                className="w-full h-10 sm:h-11 px-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] transition-colors"
              />
            </div>

            {/* Prompt Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="prompt-content" className="text-sm font-medium text-[var(--text-primary)]">
                  Prompt Content
                </label>
                {isCodestralConfigured() && (
                  <button
                    type="button"
                    onClick={() => setEnableAI(!enableAI)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                      enableAI
                        ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                        : 'bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    <ZapIcon size={12} />
                    AI Assist {enableAI ? 'ON' : 'OFF'}
                  </button>
                )}
              </div>
              <CodeCompletionTextarea
                value={content}
                onChange={setContent}
                placeholder="Write your prompt here. Be specific, structured, and clear… (Press Tab to accept AI suggestions)"
                rows={8}
                enableCompletion={enableAI}
              />
            </div>

            {/* Techniques Used */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Techniques
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTechniques.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleArrayItem(techniques, setTechniques, tech)}
                    aria-pressed={techniques.includes(tech)}
                    className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
                      techniques.includes(tech)
                        ? 'bg-[var(--primary-500)]/20 text-[var(--primary-400)] border border-[var(--primary-500)]/40'
                        : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-interactive)]'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Targets */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Works With
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableModels.map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => toggleArrayItem(models, setModels, model)}
                    aria-pressed={models.includes(model)}
                    className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
                      models.includes(model)
                        ? 'bg-[var(--primary-500)]/20 text-[var(--primary-400)] border border-[var(--primary-500)]/40'
                        : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-interactive)]'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tag-input" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag…"
                  autoComplete="off"
                  className="flex-1 h-9 px-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] transition-colors"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="primary" className="pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter(t => t !== tag))}
                        className="ml-1 p-0.5 hover:text-white rounded"
                        aria-label={`Remove ${tag} tag`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-[var(--text-tertiary)]">Suggested:</span>
                {suggestedTags.filter(t => !tags.includes(t)).slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTags([...tags, tag])}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
