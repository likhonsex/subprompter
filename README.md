# SubPrompter - Turn Ideas Into Agents

A social media platform for AI prompts and agents built with React 18, TypeScript, Vite, and Tailwind CSS.

## Features

- **Feed** - Browse and discover prompts from the community
- **AI Playground** - Test prompts with multiple AI models (Claude, GPT-4, Gemini, Codestral, and more)
- **Kanban Board** - Organize prompts through development stages
- **Teams** - Collaborate with others on prompt development
- **About, News, Contact** - Informational pages

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Neon PostgreSQL
- **AI APIs**: OpenRouter, Codestral (Mistral)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and add your API keys
3. Install dependencies: `pnpm install`
4. Start dev server: `pnpm dev`

## Environment Variables

```
VITE_DATABASE_URL=your_neon_postgres_url
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_CODESTRAL_API_KEY=your_codestral_key
```

## License

MIT
