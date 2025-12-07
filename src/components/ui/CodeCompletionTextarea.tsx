import React, { useState, useRef, useCallback } from 'react';
import { codeCompletion, isCodestralConfigured, debounce } from '../../services/codestral';

interface CodeCompletionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  enableCompletion?: boolean;
  completionDelay?: number;
}

export function CodeCompletionTextarea({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 10,
  disabled = false,
  enableCompletion = true,
  completionDelay = 500,
}: CodeCompletionTextareaProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchCompletion = useCallback(
    debounce(async (text: string, position: number) => {
      if (!enableCompletion || !isCodestralConfigured() || !text.trim()) {
        setSuggestion('');
        return;
      }
      const prefix = text.slice(0, position);
      const suffix = text.slice(position);
      const isAtLineEnd = suffix.length === 0 || suffix.startsWith('\n');
      if (!isAtLineEnd) {
        setSuggestion('');
        return;
      }
      setIsLoading(true);
      try {
        const response = await codeCompletion({ prompt: prefix, suffix, max_tokens: 100, temperature: 0.2 });
        const completionText = response.choices[0]?.text || '';
        setSuggestion(completionText.split('\n')[0]);
      } catch (error) {
        console.error('Completion error:', error);
        setSuggestion('');
      } finally {
        setIsLoading(false);
      }
    }, completionDelay),
    [enableCompletion, completionDelay]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    onChange(newValue);
    setCursorPosition(newPosition);
    setSuggestion('');
    fetchCompletion(newValue, newPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      const before = value.slice(0, cursorPosition);
      const after = value.slice(cursorPosition);
      onChange(before + suggestion + after);
      setSuggestion('');
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = cursorPosition + suggestion.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          setCursorPosition(newPos);
        }
      }, 0);
    }
    if (e.key === 'Escape' && suggestion) {
      e.preventDefault();
      setSuggestion('');
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] resize-y disabled:opacity-50 font-mono ${className}`}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
        {isLoading && <span className="text-[10px] text-[var(--text-tertiary)] animate-pulse">Thinking...</span>}
        {suggestion && !isLoading && <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-surface-1)] px-1.5 py-0.5 rounded">Tab to accept</span>}
        {enableCompletion && isCodestralConfigured() && <span className="text-[10px] text-[var(--primary-500)] bg-[var(--primary-500)]/10 px-1.5 py-0.5 rounded font-medium">AI</span>}
      </div>
    </div>
  );
}
