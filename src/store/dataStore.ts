import { create } from 'zustand';
import { neon } from '@neondatabase/serverless';
import { User, Prompt, Agent } from '../types';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL ||
  'postgresql://neondb_owner:npg_3CEscxNWoZn6@ep-crimson-wildflower-advrlynn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

// Team type
export interface Team {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: User[];
  memberCount: number;
  promptCount: number;
  createdAt: string;
}

interface DataState {
  // Data
  users: User[];
  prompts: Prompt[];
  agents: Agent[];
  teams: Team[];
  pinnedPrompts: Prompt[];

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  fetchPrompts: () => Promise<void>;
  fetchAgents: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  fetchPinnedPrompts: () => Promise<void>;
  createPrompt: (prompt: Partial<Prompt>, authorId: string) => Promise<Prompt | null>;
  pinPrompt: (promptId: string, userId: string) => Promise<void>;
  unpinPrompt: (promptId: string, userId: string) => Promise<void>;
  joinTeam: (teamId: string, userId: string) => Promise<void>;
  createTeam: (name: string, description: string, creatorId: string) => Promise<Team | null>;
}

// Transform DB row to Prompt type
const transformPrompt = (row: any, users: Map<string, User>): Prompt => ({
  id: row.id,
  title: row.title,
  content: row.content,
  author: users.get(row.author_id) || {
    id: row.author_id,
    handle: 'unknown',
    name: 'Unknown User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
    bio: '',
    credibilityScore: 0,
    followers: 0,
    following: 0,
    createdPrompts: 0,
    createdAgents: 0,
    joinedAt: new Date().toISOString(),
  },
  tags: row.tags || [],
  techniquesUsed: row.techniques_used || [],
  modelTargets: row.model_targets || [],
  ratingScore: parseFloat(row.rating_score) || 0,
  ratingSignals: {
    worksAsClaimed: row.rating_works_as_claimed || 0,
    reusable: row.rating_reusable || 0,
    structured: row.rating_structured || 0,
    agentReady: row.rating_agent_ready || 0,
  },
  forkCount: row.fork_count || 0,
  commentCount: row.comment_count || 0,
  bookmarkCount: row.bookmark_count || 0,
  forkedFrom: row.forked_from,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Transform DB row to Agent type
const transformAgent = (row: any, users: Map<string, User>): Agent => ({
  id: row.id,
  name: row.name,
  description: row.description,
  creator: users.get(row.creator_id) || {
    id: row.creator_id,
    handle: 'unknown',
    name: 'Unknown User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
    bio: '',
    credibilityScore: 0,
    followers: 0,
    following: 0,
    createdPrompts: 0,
    createdAgents: 0,
    joinedAt: new Date().toISOString(),
  },
  avatar: row.avatar,
  promptChain: row.prompt_chain || [],
  performanceRating: parseFloat(row.performance_rating) || 0,
  usageCount: row.usage_count || 0,
  followers: row.followers || 0,
  tags: row.tags || [],
  createdAt: row.created_at,
});

// Transform DB row to User type
const transformUser = (row: any): User => ({
  id: row.id,
  handle: row.handle,
  name: row.name,
  avatar: row.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  bio: row.bio || '',
  credibilityScore: row.credibility_score || 50,
  followers: row.followers || 0,
  following: row.following || 0,
  createdPrompts: row.created_prompts || 0,
  createdAgents: row.created_agents || 0,
  joinedAt: row.joined_at,
});

export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  prompts: [],
  agents: [],
  teams: [],
  pinnedPrompts: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      // Create tables if they don't exist
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          handle TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          avatar TEXT,
          bio TEXT,
          credibility_score INTEGER DEFAULT 50,
          followers INTEGER DEFAULT 0,
          following INTEGER DEFAULT 0,
          created_prompts INTEGER DEFAULT 0,
          created_agents INTEGER DEFAULT 0,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          email TEXT UNIQUE,
          password_hash TEXT
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS prompts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author_id TEXT REFERENCES users(id),
          tags TEXT[] DEFAULT '{}',
          techniques_used TEXT[] DEFAULT '{}',
          model_targets TEXT[] DEFAULT '{}',
          rating_score DECIMAL(3,1) DEFAULT 0,
          rating_works_as_claimed INTEGER DEFAULT 0,
          rating_reusable INTEGER DEFAULT 0,
          rating_structured INTEGER DEFAULT 0,
          rating_agent_ready INTEGER DEFAULT 0,
          fork_count INTEGER DEFAULT 0,
          comment_count INTEGER DEFAULT 0,
          bookmark_count INTEGER DEFAULT 0,
          forked_from TEXT,
          is_pinned BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS agents (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          creator_id TEXT REFERENCES users(id),
          avatar TEXT,
          prompt_chain TEXT[] DEFAULT '{}',
          performance_rating DECIMAL(3,1) DEFAULT 0,
          usage_count INTEGER DEFAULT 0,
          followers INTEGER DEFAULT 0,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          avatar TEXT,
          creator_id TEXT REFERENCES users(id),
          member_count INTEGER DEFAULT 1,
          prompt_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS team_members (
          id TEXT PRIMARY KEY,
          team_id TEXT REFERENCES teams(id),
          user_id TEXT REFERENCES users(id),
          role TEXT DEFAULT 'member',
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(team_id, user_id)
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS pinned_prompts (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id),
          prompt_id TEXT REFERENCES prompts(id),
          pinned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, prompt_id)
        )
      `;

      // Seed initial data if empty
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      if (Number(userCount[0].count) === 0) {
        await seedInitialData();
      }

      // Fetch all data
      await Promise.all([
        get().fetchPrompts(),
        get().fetchAgents(),
        get().fetchTeams(),
        get().fetchPinnedPrompts(),
      ]);

      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      set({ error: 'Failed to connect to database', isLoading: false });
    }
  },

  fetchPrompts: async () => {
    try {
      const usersResult = await sql`SELECT * FROM users`;
      const users = new Map(usersResult.map((u: any) => [u.id, transformUser(u)]));
      set({ users: Array.from(users.values()) });

      const promptsResult = await sql`SELECT * FROM prompts ORDER BY created_at DESC`;
      const prompts = promptsResult.map((p: any) => transformPrompt(p, users));
      set({ prompts });
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  },

  fetchAgents: async () => {
    try {
      const usersResult = await sql`SELECT * FROM users`;
      const users = new Map(usersResult.map((u: any) => [u.id, transformUser(u)]));

      const agentsResult = await sql`SELECT * FROM agents ORDER BY performance_rating DESC`;
      const agents = agentsResult.map((a: any) => transformAgent(a, users));
      set({ agents });
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  },

  fetchTeams: async () => {
    try {
      const teamsResult = await sql`
        SELECT t.*,
          (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count,
          (SELECT COUNT(*) FROM prompts p
           JOIN team_members tm ON p.author_id = tm.user_id
           WHERE tm.team_id = t.id) as prompt_count
        FROM teams t
        ORDER BY member_count DESC
      `;

      const teams: Team[] = await Promise.all(teamsResult.map(async (t: any) => {
        const membersResult = await sql`
          SELECT u.* FROM users u
          JOIN team_members tm ON u.id = tm.user_id
          WHERE tm.team_id = ${t.id}
          LIMIT 5
        `;

        return {
          id: t.id,
          name: t.name,
          description: t.description || '',
          avatar: t.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${t.name}`,
          members: membersResult.map(transformUser),
          memberCount: Number(t.member_count) || 0,
          promptCount: Number(t.prompt_count) || 0,
          createdAt: t.created_at,
        };
      }));

      set({ teams });
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  },

  fetchPinnedPrompts: async () => {
    try {
      const usersResult = await sql`SELECT * FROM users`;
      const users = new Map(usersResult.map((u: any) => [u.id, transformUser(u)]));

      const pinnedResult = await sql`
        SELECT p.* FROM prompts p
        WHERE p.is_pinned = true
        ORDER BY p.rating_score DESC
        LIMIT 10
      `;

      const pinnedPrompts = pinnedResult.map((p: any) => transformPrompt(p, users));
      set({ pinnedPrompts });
    } catch (error) {
      console.error('Failed to fetch pinned prompts:', error);
    }
  },

  createPrompt: async (promptData, authorId) => {
    try {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO prompts (id, title, content, author_id, tags, techniques_used, model_targets, forked_from)
        VALUES (
          ${id},
          ${promptData.title},
          ${promptData.content},
          ${authorId},
          ${promptData.tags || []},
          ${promptData.techniquesUsed || []},
          ${promptData.modelTargets || []},
          ${promptData.forkedFrom || null}
        )
      `;

      await sql`UPDATE users SET created_prompts = created_prompts + 1 WHERE id = ${authorId}`;

      await get().fetchPrompts();

      const prompt = get().prompts.find(p => p.id === id);
      return prompt || null;
    } catch (error) {
      console.error('Failed to create prompt:', error);
      return null;
    }
  },

  pinPrompt: async (promptId, userId) => {
    try {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO pinned_prompts (id, user_id, prompt_id)
        VALUES (${id}, ${userId}, ${promptId})
        ON CONFLICT (user_id, prompt_id) DO NOTHING
      `;
      await sql`UPDATE prompts SET is_pinned = true WHERE id = ${promptId}`;
      await get().fetchPinnedPrompts();
    } catch (error) {
      console.error('Failed to pin prompt:', error);
    }
  },

  unpinPrompt: async (promptId, userId) => {
    try {
      await sql`DELETE FROM pinned_prompts WHERE user_id = ${userId} AND prompt_id = ${promptId}`;

      const remaining = await sql`SELECT COUNT(*) as count FROM pinned_prompts WHERE prompt_id = ${promptId}`;
      if (Number(remaining[0].count) === 0) {
        await sql`UPDATE prompts SET is_pinned = false WHERE id = ${promptId}`;
      }

      await get().fetchPinnedPrompts();
    } catch (error) {
      console.error('Failed to unpin prompt:', error);
    }
  },

  joinTeam: async (teamId, userId) => {
    try {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO team_members (id, team_id, user_id)
        VALUES (${id}, ${teamId}, ${userId})
        ON CONFLICT (team_id, user_id) DO NOTHING
      `;
      await get().fetchTeams();
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  },

  createTeam: async (name, description, creatorId) => {
    try {
      const teamId = crypto.randomUUID();
      const memberId = crypto.randomUUID();

      await sql`
        INSERT INTO teams (id, name, description, creator_id, avatar)
        VALUES (${teamId}, ${name}, ${description}, ${creatorId}, ${`https://api.dicebear.com/7.x/shapes/svg?seed=${name}`})
      `;

      await sql`
        INSERT INTO team_members (id, team_id, user_id, role)
        VALUES (${memberId}, ${teamId}, ${creatorId}, 'owner')
      `;

      await get().fetchTeams();

      return get().teams.find(t => t.id === teamId) || null;
    } catch (error) {
      console.error('Failed to create team:', error);
      return null;
    }
  },
}));

// Seed initial data
async function seedInitialData() {
  console.log('Seeding initial data...');

  // Create users
  const users = [
    { id: 'u1', handle: 'promptmaster', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', bio: 'Building the future of AI interactions. CoT enthusiast.', credibility_score: 94 },
    { id: 'u2', handle: 'agentsmith', name: 'Marcus Wright', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', bio: 'Agent architect. RAG specialist.', credibility_score: 89 },
    { id: 'u3', handle: 'reasoning_queen', name: 'Aisha Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha', bio: 'PhD in reasoning systems.', credibility_score: 97 },
    { id: 'u4', handle: 'codewhisperer', name: 'Jake Morrison', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake', bio: 'Full-stack prompt engineer.', credibility_score: 85 },
  ];

  for (const u of users) {
    await sql`
      INSERT INTO users (id, handle, name, avatar, bio, credibility_score)
      VALUES (${u.id}, ${u.handle}, ${u.name}, ${u.avatar}, ${u.bio}, ${u.credibility_score})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // Create prompts
  const prompts = [
    {
      id: 'p1',
      title: 'Universal Code Reviewer Agent',
      content: `You are an expert code reviewer with 20 years of experience across multiple languages and paradigms.

TASK: Review the provided code and deliver actionable feedback.

PROCESS:
1. First, identify the programming language and framework
2. Analyze code structure and architecture
3. Check for security vulnerabilities
4. Evaluate performance implications
5. Assess readability and maintainability

OUTPUT FORMAT:
- Summary (1-2 sentences)
- Critical Issues (must fix)
- Improvements (should fix)
- Suggestions (nice to have)
- Score: X/10

Be specific. Reference line numbers. Suggest exact fixes.`,
      author_id: 'u1',
      tags: ['coding', 'review', 'security'],
      techniques_used: ['Role', 'CoT', 'Structured Output'],
      model_targets: ['GPT-4', 'Claude'],
      rating_score: 4.8,
      rating_works_as_claimed: 342,
      rating_reusable: 289,
      rating_structured: 312,
      rating_agent_ready: 256,
      fork_count: 127,
      is_pinned: true,
    },
    {
      id: 'p2',
      title: 'Step-by-Step Problem Solver',
      content: `You are a world-class problem solver who breaks down complex challenges into manageable steps.

APPROACH:
- Never jump to conclusions
- Show your reasoning at each step
- Consider multiple perspectives
- Validate assumptions before proceeding

FORMAT YOUR RESPONSE:
## Understanding the Problem
[Restate the problem in your own words]

## Key Constraints
[List all constraints and requirements]

## Step-by-Step Solution
1. [First step with reasoning]
2. [Second step with reasoning]
...

## Verification
[Check your solution against requirements]

## Final Answer
[Clear, actionable conclusion]`,
      author_id: 'u3',
      tags: ['reasoning', 'problem-solving', 'education'],
      techniques_used: ['CoT', 'Self-Verification', 'Structured Output'],
      model_targets: ['GPT-4', 'Claude', 'Gemini'],
      rating_score: 4.9,
      rating_works_as_claimed: 567,
      rating_reusable: 489,
      rating_structured: 534,
      rating_agent_ready: 123,
      fork_count: 234,
      is_pinned: true,
    },
  ];

  for (const p of prompts) {
    await sql`
      INSERT INTO prompts (id, title, content, author_id, tags, techniques_used, model_targets, rating_score, rating_works_as_claimed, rating_reusable, rating_structured, rating_agent_ready, fork_count, is_pinned)
      VALUES (${p.id}, ${p.title}, ${p.content}, ${p.author_id}, ${p.tags}, ${p.techniques_used}, ${p.model_targets}, ${p.rating_score}, ${p.rating_works_as_claimed}, ${p.rating_reusable}, ${p.rating_structured}, ${p.rating_agent_ready}, ${p.fork_count}, ${p.is_pinned})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // Create agents
  const agents = [
    { id: 'a1', name: 'CodeGuard', description: 'Autonomous code review agent that catches bugs before they hit production.', creator_id: 'u1', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=codeguard', tags: ['coding', 'security'], performance_rating: 4.8, usage_count: 12450 },
    { id: 'a2', name: 'ReasonBot', description: 'Multi-step reasoning agent for complex problem solving.', creator_id: 'u3', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=reasonbot', tags: ['reasoning', 'analysis'], performance_rating: 4.9, usage_count: 8900 },
  ];

  for (const a of agents) {
    await sql`
      INSERT INTO agents (id, name, description, creator_id, avatar, tags, performance_rating, usage_count)
      VALUES (${a.id}, ${a.name}, ${a.description}, ${a.creator_id}, ${a.avatar}, ${a.tags}, ${a.performance_rating}, ${a.usage_count})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  // Create teams
  const teams = [
    { id: 't1', name: 'Prompt Engineers Guild', description: 'A community of prompt engineering enthusiasts sharing best practices.', creator_id: 'u1' },
    { id: 't2', name: 'AI Agents Builders', description: 'Building autonomous AI agents for real-world applications.', creator_id: 'u2' },
  ];

  for (const t of teams) {
    await sql`
      INSERT INTO teams (id, name, description, creator_id, avatar)
      VALUES (${t.id}, ${t.name}, ${t.description}, ${t.creator_id}, ${`https://api.dicebear.com/7.x/shapes/svg?seed=${t.name}`})
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO team_members (id, team_id, user_id, role)
      VALUES (${crypto.randomUUID()}, ${t.id}, ${t.creator_id}, 'owner')
      ON CONFLICT (team_id, user_id) DO NOTHING
    `;
  }

  console.log('Initial data seeded successfully');
}
