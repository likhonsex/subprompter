import React from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { SparklesIcon, BotIcon, UsersIcon, ForkIcon, StarIcon, ZapIcon } from './icons';

export function AboutPage() {
  const stats = [
    { label: 'Prompts Shared', value: '12,500+', icon: SparklesIcon },
    { label: 'Active Users', value: '8,200+', icon: UsersIcon },
    { label: 'AI Agents', value: '1,400+', icon: BotIcon },
    { label: 'Forks Created', value: '45,000+', icon: ForkIcon },
  ];

  const features = [
    { title: 'Share & Discover Prompts', description: 'Browse thousands of community-curated prompts.', icon: SparklesIcon },
    { title: 'Build AI Agents', description: 'Chain prompts together to create powerful agents.', icon: BotIcon },
    { title: 'Fork & Improve', description: 'Build on the work of others and share back.', icon: ForkIcon },
    { title: 'AI-Powered Editor', description: 'Write prompts faster with Codestral completion.', icon: ZapIcon },
    { title: 'Credibility System', description: 'Earn reputation through quality contributions.', icon: StarIcon },
    { title: 'Team Collaboration', description: 'Work together on prompts with your team.', icon: UsersIcon },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'Founder & CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-founder' },
    { name: 'Marcus Wright', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-cto' },
    { name: 'Aisha Patel', role: 'Head of AI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha-ai' },
    { name: 'Jake Morrison', role: 'Lead Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake-eng' },
  ];

  return (
    <main className="flex-1 min-h-screen lg:border-x border-[var(--border-default)]" id="main-content">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/10 via-purple-500/5 to-transparent" />
        <div className="relative px-6 py-16 sm:py-24 text-center">
          <Badge variant="primary" size="sm" className="mb-4">About SubPrompter</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Turn Ideas Into <span className="text-[var(--primary-500)]">Agents</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            SubPrompter is the community platform for sharing, discovering, and building AI prompts and agents.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary" size="lg">Join the Community</Button>
            <Button variant="secondary" size="lg">Explore Prompts</Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 border-y border-[var(--border-default)] bg-[var(--bg-surface-1)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon size={24} className="mx-auto text-[var(--primary-500)] mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{stat.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-12">Everything You Need to Build with AI</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-xl hover:border-[var(--primary-500)]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-[var(--primary-500)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 border-t border-[var(--border-default)] bg-[var(--bg-surface-1)]">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-4">Meet the Team</h2>
        <p className="text-[var(--text-secondary)] text-center mb-12 max-w-xl mx-auto">We're a team of AI enthusiasts passionate about making AI accessible.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[var(--border-default)]" />
              <h3 className="font-medium text-[var(--text-primary)]">{member.name}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 border-t border-[var(--border-default)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Our Mission</h2>
          <p className="text-lg text-[var(--text-secondary)]">
            We believe that the best AI interactions come from well-crafted prompts. Our mission is to create a collaborative platform where anyone can learn, share, and build better AI experiences.
          </p>
        </div>
      </section>
    </main>
  );
}
