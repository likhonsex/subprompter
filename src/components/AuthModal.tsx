import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, UserIcon, AtSignIcon, LoaderIcon } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    handle: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const { login, register, isLoading, error, clearError } = useAuthStore();

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', name: '', handle: '', confirmPassword: '' });
      setValidationError('');
      clearError();
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen, mode, clearError]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
    clearError();
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }

    if (mode === 'register') {
      if (!formData.name || !formData.handle) {
        setValidationError('Please fill in all required fields');
        return false;
      }

      if (formData.handle.length < 3) {
        setValidationError('Handle must be at least 3 characters');
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(formData.handle)) {
        setValidationError('Handle can only contain letters, numbers, and underscores');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let success = false;

    if (mode === 'login') {
      success = await login(formData.email, formData.password);
    } else {
      success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        handle: formData.handle
      });
    }

    if (success) {
      onClose();
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setValidationError('');
    clearError();
  };

  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md sm:mx-4 max-h-[100dvh] sm:max-h-[90vh] overflow-hidden bg-[var(--bg-surface-1)] sm:rounded-xl border-t sm:border border-[var(--border-default)] shadow-layered animate-slide-up sm:animate-scale-in">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <header className="px-5 pt-5 pb-4 text-center border-b border-[var(--border-default)]">
            <h2 id="auth-modal-title" className="text-xl font-semibold text-[var(--text-primary)]">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {mode === 'login'
                ? 'Sign in to continue to SubPrompter'
                : 'Join the community of prompt engineers'}
            </p>
          </header>

          {/* Form Content */}
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Error Message */}
            {displayError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{displayError}</p>
              </div>
            )}

            {/* Name Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Handle Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="handle" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <AtSignIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    id="handle"
                    name="handle"
                    type="text"
                    value={formData.handle}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    autoComplete="username"
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <MailIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  ref={mode === 'login' ? emailInputRef : undefined}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-11 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-lg text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="px-5 pb-5 pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? (
                <>
                  <LoaderIcon size={16} className="animate-spin mr-2" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>

            <div className="text-center">
              <span className="text-sm text-[var(--text-secondary)]">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium transition-colors disabled:opacity-50"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
