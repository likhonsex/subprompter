import { User, Prompt, SubPrompt, Agent } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    handle: 'promptmaster',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Building the future of AI interactions. CoT enthusiast. Ex-OpenAI.',
    credibilityScore: 94,
    followers: 12400,
    following: 342,
    createdPrompts: 156,
    createdAgents: 23,
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    handle: 'agentsmith',
    name: 'Marcus Wright',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    bio: 'Agent architect. RAG specialist. Building autonomous systems.',
    credibilityScore: 89,
    followers: 8700,
    following: 156,
    createdPrompts: 89,
    createdAgents: 45,
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    handle: 'reasoning_queen',
    name: 'Aisha Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha',
    bio: 'PhD in reasoning systems. Making AI think step by step.',
    credibilityScore: 97,
    followers: 21000,
    following: 89,
    createdPrompts: 234,
    createdAgents: 12,
    joinedAt: '2023-11-08',
  },
  {
    id: '4',
    handle: 'codewhisperer',
    name: 'Jake Morrison',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake',
    bio: 'Turning prompts into production code. Full-stack prompt engineer.',
    credibilityScore: 85,
    followers: 5600,
    following: 234,
    createdPrompts: 67,
    createdAgents: 8,
    joinedAt: '2024-03-01',
  },
];

export const mockPrompts: Prompt[] = [
  {
    id: '1',
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
    author: mockUsers[0],
    tags: ['coding', 'review', 'security'],
    techniquesUsed: ['Role', 'CoT', 'Structured Output'],
    modelTargets: ['GPT-4', 'Claude'],
    ratingScore: 4.8,
    ratingSignals: { worksAsClaimed: 342, reusable: 289, structured: 312, agentReady: 256 },
    forkCount: 127,
    commentCount: 45,
    bookmarkCount: 890,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-06',
  },
  {
    id: '2',
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
    author: mockUsers[2],
    tags: ['reasoning', 'problem-solving', 'education'],
    techniquesUsed: ['CoT', 'Self-Verification', 'Structured Output'],
    modelTargets: ['GPT-4', 'Claude', 'Gemini'],
    ratingScore: 4.9,
    ratingSignals: { worksAsClaimed: 567, reusable: 489, structured: 534, agentReady: 123 },
    forkCount: 234,
    commentCount: 78,
    bookmarkCount: 1245,
    createdAt: '2024-11-25',
    updatedAt: '2024-11-30',
  },
  {
    id: '3',
    title: 'RAG-Optimized Query Transformer',
    content: `You transform user queries into optimized search queries for RAG systems.

INPUT: Natural language question
OUTPUT: JSON with search parameters

TRANSFORMATION RULES:
1. Extract key entities and concepts
2. Identify query intent (factual, comparison, how-to, etc.)
3. Generate semantic variations
4. Determine optimal chunk retrieval count

RESPONSE FORMAT:
{
  "original_query": "",
  "intent": "",
  "entities": [],
  "optimized_queries": [],
  "semantic_variations": [],
  "suggested_k": 5,
  "filters": {}
}

Always output valid JSON. No explanations outside the JSON.`,
    author: mockUsers[1],
    tags: ['RAG', 'search', 'retrieval'],
    techniquesUsed: ['Role', 'JSON Mode', 'Query Expansion'],
    modelTargets: ['GPT-4', 'Claude'],
    ratingScore: 4.6,
    ratingSignals: { worksAsClaimed: 234, reusable: 345, structured: 456, agentReady: 389 },
    forkCount: 89,
    commentCount: 23,
    bookmarkCount: 456,
    createdAt: '2024-11-20',
    updatedAt: '2024-11-28',
  },
  {
    id: '8',
    title: 'Creative Writing Partner',
    content: `You are a collaborative creative writing assistant with expertise in multiple genres.

YOUR APPROACH:
1. Understand the writer's vision and style
2. Offer suggestions without overwriting their voice
3. Provide alternatives, not replacements
4. Help with pacing, dialogue, and world-building

INTERACTION STYLE:
- Ask clarifying questions
- Offer 2-3 options when suggesting
- Respect the author's final decisions`,
    author: mockUsers[2],
    tags: ['writing', 'creative', 'storytelling'],
    techniquesUsed: ['Role', 'Socratic Method', 'Few-Shot'],
    modelTargets: ['Claude', 'GPT-4'],
    ratingScore: 4.7,
    ratingSignals: { worksAsClaimed: 234, reusable: 267, structured: 145, agentReady: 89 },
    forkCount: 112,
    commentCount: 67,
    bookmarkCount: 678,
    createdAt: '2024-12-06',
    updatedAt: '2024-12-06',
  },
  {
    id: '9',
    title: 'Data Analysis Assistant',
    content: `You are a data scientist assistant who helps interpret and visualize data.

CAPABILITIES:
- Exploratory data analysis
- Statistical summaries
- Visualization recommendations
- Insight extraction

Always ask for data context before diving into analysis.`,
    author: mockUsers[0],
    tags: ['data', 'analysis', 'visualization'],
    techniquesUsed: ['Role', 'CoT', 'Structured Output'],
    modelTargets: ['GPT-4', 'Claude'],
    ratingScore: 4.5,
    ratingSignals: { worksAsClaimed: 178, reusable: 189, structured: 234, agentReady: 156 },
    forkCount: 34,
    commentCount: 19,
    bookmarkCount: 234,
    createdAt: '2024-12-06',
    updatedAt: '2024-12-06',
  },
];

export const mockSubPrompts: SubPrompt[] = [
  {
    id: 's1',
    promptId: '1',
    author: mockUsers[1],
    content: 'Added a preprocessing step to normalize code formatting before review.',
    role: 'step',
    isReusable: true,
    upvotes: 45,
    createdAt: '2024-11-29',
  },
  {
    id: 's2',
    promptId: '1',
    author: mockUsers[2],
    content: 'Integrated with ESLint output parser for JavaScript projects.',
    role: 'tool_call',
    isReusable: true,
    upvotes: 67,
    createdAt: '2024-11-30',
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'a1',
    name: 'CodeGuard',
    description: 'Autonomous code review agent that catches bugs before they hit production.',
    creator: mockUsers[0],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=codeguard',
    promptChain: ['1', '5'],
    performanceRating: 4.8,
    usageCount: 12450,
    followers: 3400,
    tags: ['coding', 'security', 'automation'],
    createdAt: '2024-12-05',
  },
  {
    id: 'a2',
    name: 'ReasonBot',
    description: 'Multi-step reasoning agent for complex problem solving.',
    creator: mockUsers[2],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=reasonbot',
    promptChain: ['2'],
    performanceRating: 4.9,
    usageCount: 8900,
    followers: 2100,
    tags: ['reasoning', 'research', 'analysis'],
    createdAt: '2024-12-04',
  },
  {
    id: 'a3',
    name: 'DocuMate',
    description: 'Technical documentation agent. From code to comprehensive docs in seconds.',
    creator: mockUsers[3],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=documate',
    promptChain: ['4'],
    performanceRating: 4.5,
    usageCount: 5600,
    followers: 1200,
    tags: ['documentation', 'developer-tools'],
    createdAt: '2024-11-01',
  },
  {
    id: 'a4',
    name: 'RAGMaster',
    description: 'Intelligent retrieval agent that optimizes queries for maximum relevance.',
    creator: mockUsers[1],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ragmaster',
    promptChain: ['3'],
    performanceRating: 4.6,
    usageCount: 7200,
    followers: 1800,
    tags: ['RAG', 'search', 'enterprise'],
    createdAt: '2024-10-28',
  },
  {
    id: 'a5',
    name: 'WriteFlow',
    description: 'Creative writing companion that helps you craft compelling narratives.',
    creator: mockUsers[2],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=writeflow',
    promptChain: ['8'],
    performanceRating: 4.7,
    usageCount: 9800,
    followers: 2800,
    tags: ['writing', 'creative', 'storytelling'],
    createdAt: '2024-12-06',
  },
];

export const currentUser: User = mockUsers[0];
