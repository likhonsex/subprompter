import React, { useState } from 'react';
import { Button } from './ui/Button';
import { MailIcon, MessageIcon, UsersIcon, SparklesIcon } from './icons';

type FormType = 'contact' | 'feedback' | 'support' | 'partnership';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'contact' as FormType, subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formTypes = [
    { id: 'contact', label: 'General Contact', icon: MailIcon, description: 'Say hello or ask a question' },
    { id: 'feedback', label: 'Feedback', icon: SparklesIcon, description: 'Share your thoughts' },
    { id: 'support', label: 'Support', icon: MessageIcon, description: 'Get help with an issue' },
    { id: 'partnership', label: 'Partnership', icon: UsersIcon, description: 'Business inquiries' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)] flex items-center justify-center p-6" id="main-content">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Message Sent!</h2>
          <p className="text-[var(--text-secondary)] mb-6">We'll get back to you within 24-48 hours.</p>
          <Button variant="primary" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)]" id="main-content">
      <header className="sticky top-0 z-20 bg-[var(--bg-page)]/80 backdrop-blur-xl border-b border-[var(--border-default)] px-6 py-4">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Contact Us</h1>
        <p className="text-sm text-[var(--text-secondary)]">Get in touch with the SubPrompter team</p>
      </header>

      <div className="p-6 pb-20 lg:pb-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {formTypes.map((type) => (
            <button key={type.id} type="button" onClick={() => setFormData({ ...formData, type: type.id as FormType })} className={`p-4 rounded-xl border text-left transition-all ${formData.type === type.id ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10' : 'border-[var(--border-default)] bg-[var(--bg-surface-1)] hover:border-[var(--border-hover)]'}`}>
              <type.icon size={20} className={formData.type === type.id ? 'text-[var(--primary-500)]' : 'text-[var(--text-secondary)]'} />
              <h3 className="font-medium text-[var(--text-primary)] text-sm mt-2">{type.label}</h3>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5 line-clamp-2">{type.description}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Your Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" className="w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="john@example.com" className="w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Subject</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required placeholder="What's this about?" className="w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Message</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={6} placeholder="Tell us more..." className="w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] resize-none" />
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-[var(--text-tertiary)]">We typically respond within 24-48 hours.</p>
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
