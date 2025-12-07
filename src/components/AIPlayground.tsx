import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { chatCompletion, FEATURED_MODELS, isConfigured, Message } from '../services/openrouter';
import { codestralChat, isCodestralConfigured } from '../services/codestral';
import { SparklesIcon, LoaderIcon, ZapIcon, ArrowUpIcon, LockIcon } from './icons';
import { useAuthStore } from '../store/authStore';

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
}

interface AIPlaygroundProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export function AIPlayground({ onOpenAuth }: AIPlaygroundProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [selectedModel, setSelectedModel] = useState(FEATURED_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);

  const { user, isAuthenticated } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const allMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ];

      // Check if using Codestral
      const currentModelConfig = FEATURED_MODELS.find(m => m.id === selectedModel);
      const isCodestral = (currentModelConfig as any)?.isCodestral;

      let responseContent: string;

      if (isCodestral && isCodestralConfigured()) {
        // Use Codestral API directly
        const response = await codestralChat({
          messages: allMessages,
          temperature,
        });
        responseContent = response.choices[0]?.message?.content || 'No response';
      } else {
        // Use OpenRouter
        const response = await chatCompletion({
          model: selectedModel,
          messages: allMessages,
          temperature,
        });
        responseContent = response.choices[0]?.message?.content || 'No response';
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const currentModel = FEATURED_MODELS.find(m => m.id === selectedModel);

  // API not configured
  if (!isConfigured()) {
    return (
      <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <SparklesIcon size={48} className="mx-auto text-[var(--text-tertiary)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">API Not Configured</h2>
          <p className="text-[var(--text-secondary)]">Add your OpenRouter API key to enable the AI Playground.</p>
        </div>
      </main>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-500)]/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <LockIcon size={40} className="text-[var(--primary-500)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Sign in to use AI Playground</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Create an account or sign in to start chatting with AI models. It's free and takes just a moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth?.('login')}
              className="justify-center"
            >
              Sign in
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onOpenAuth?.('register')}
              className="justify-center"
            >
              Create account
            </Button>
          </div>
          <div className="mt-8 p-4 bg-[var(--bg-surface-2)] rounded-xl border border-[var(--border-default)]">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">What you'll get:</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span> Access to 8+ AI models (Claude, GPT-4, Gemini...)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span> Custom system prompts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span> Temperature & creativity controls
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span> Save and share your prompts
              </li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex flex-col pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--bg-surface-1)]/95 backdrop-blur-md border-b border-[var(--border-default)]">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-purple-500 flex items-center justify-center">
              <SparklesIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-[var(--text-primary)]">AI Playground</h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Welcome, {user?.name?.split(' ')[0] || 'User'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              Clear
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 border-t border-[var(--border-default)] space-y-4 bg-[var(--bg-surface-2)]">
            {/* Model Selector */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Model</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FEATURED_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedModel === model.id
                        ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10'
                        : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">{model.name}</span>
                      {model.badge && (
                        <Badge variant={model.badge === 'Best' ? 'success' : model.badge === 'Fast' ? 'warning' : model.badge === 'Code' ? 'default' : 'primary'} size="sm">
                          {model.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)]">{model.provider}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] resize-none"
                placeholder="Set the AI's behavior..."
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Temperature: {temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[var(--primary-500)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Model Indicator */}
        <div className="px-4 py-2 border-t border-[var(--border-default)] flex items-center gap-2 text-xs">
          <ZapIcon size={12} className="text-[var(--primary-500)]" />
          <span className="text-[var(--text-secondary)]">Using</span>
          <span className="font-medium text-[var(--text-primary)]">{currentModel?.name}</span>
          <span className="text-[var(--text-tertiary)]">by {currentModel?.provider}</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-500)]/20 to-purple-500/20 flex items-center justify-center mb-4">
              <SparklesIcon size={32} className="text-[var(--primary-500)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Start a Conversation</h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm">
              Test your prompts with {FEATURED_MODELS.length} different AI models. Try asking a question!
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['Explain quantum computing', 'Write a haiku about coding', 'Analyze this prompt...'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-sm bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] border border-[var(--border-default)] rounded-full text-[var(--text-secondary)] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[var(--primary-500)] text-white rounded-br-md'
                    : 'bg-[var(--bg-surface-2)] text-[var(--text-primary)] rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-white/60' : 'text-[var(--text-tertiary)]'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-surface-2)] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <LoaderIcon size={16} className="animate-spin text-[var(--primary-500)]" />
                <span className="text-sm text-[var(--text-secondary)]">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 lg:relative border-t border-[var(--border-default)] bg-[var(--bg-surface-1)] p-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] resize-none disabled:opacity-50"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 p-0 justify-center rounded-xl shrink-0"
            aria-label="Send message"
          >
            {isLoading ? <LoaderIcon size={18} className="animate-spin" /> : <ArrowUpIcon size={18} />}
          </Button>
        </form>
        <p className="text-[10px] text-[var(--text-tertiary)] mt-2 text-center">
          Powered by OpenRouter & Codestral · Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </main>
  );
}
