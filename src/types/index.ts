export interface User {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  credibilityScore: number;
  followers: number;
  following: number;
  createdPrompts: number;
  createdAgents: number;
  joinedAt: string;
}

export interface RatingSignals {
  worksAsClaimed: number;
  reusable: number;
  structured: number;
  agentReady: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  techniquesUsed: string[];
  modelTargets: string[];
  ratingScore: number;
  ratingSignals: RatingSignals;
  forkCount: number;
  commentCount: number;
  bookmarkCount: number;
  forkedFrom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubPrompt {
  id: string;
  promptId: string;
  author: User;
  content: string;
  role: 'step' | 'tool_call' | 'reasoning' | 'refinement';
  isReusable: boolean;
  upvotes: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  creator: User;
  avatar: string;
  promptChain: string[];
  performanceRating: number;
  usageCount: number;
  followers: number;
  tags: string[];
  createdAt: string;
}

export type FeedType = 'trending' | 'new' | 'agents' | 'forked' | 'personalized';

export interface RatingAction {
  type: keyof RatingSignals;
  label: string;
  icon: string;
}
