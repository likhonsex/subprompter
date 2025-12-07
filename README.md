# SubPrompter — Turn Ideas Into Agents

A social media platform for AI prompts and agents built with React, TypeScript, Vite, and Tailwind CSS.

![SubPrompter](https://img.shields.io/badge/SubPrompter-AI%20Prompt%20Platform-blue)

## 🚀 Live Demo

**[View Live Demo](https://58od77huh4mu.space.minimax.io)**

## ✨ Features

- **📝 Prompt Sharing** - Create, share, and discover AI prompts with the community
- **🤖 AI Agents** - Build and deploy autonomous agents from prompt chains
- **👥 Teams** - Collaborate with other prompt engineers
- **🎮 AI Playground** - Test prompts with multiple AI models (Claude, GPT-4, Gemini, Codestral)
- **📋 Kanban Board** - Track prompt development from draft to featured
- **🔐 Authentication** - User registration and login with persistent sessions
- **💬 AI Code Completion** - Codestral-powered inline suggestions when writing prompts
- **📱 Responsive Design** - Mobile-first design with desktop optimization

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with CSS custom properties
- **State Management**: Zustand with persist middleware
- **Database**: Neon PostgreSQL (serverless)
- **AI APIs**: OpenRouter (multi-model) + Codestral (code completion)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/likhonsex/subprompter.git
cd subprompter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file with:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_CODESTRAL_API_KEY=your_codestral_key
VITE_DATABASE_URL=your_neon_postgres_url
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── icons/          # SVG icon components
│   ├── Feed.tsx        # Main feed component
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── AIPlayground.tsx # AI chat interface
│   ├── KanbanBoard.tsx # Drag-and-drop kanban
│   └── ...
├── store/              # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── dataStore.ts    # Data + Neon DB integration
├── services/           # API integrations
│   ├── openrouter.ts   # OpenRouter API
│   └── codestral.ts    # Codestral API
├── data/               # Mock data
├── types/              # TypeScript types
└── App.tsx             # Main app component
```

## 🎨 Features Overview

### AI Playground
Test prompts with 9 different AI models:
- Claude 3.5 Sonnet
- GPT-4o
- Gemini 1.5 Pro
- Codestral (via Mistral)
- And more...

### Prompt Cards
- Rating signals (Works as claimed, Reusable, Structured, Agent-ready)
- Fork count, comments, bookmarks
- Technique tags (CoT, Role, Few-Shot, RAG, etc.)
- Model compatibility indicators

### Code Completion
When writing prompts, get AI-powered suggestions:
- Press **Tab** to accept suggestions
- Press **Escape** to dismiss
- Toggle AI assist on/off

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 📄 License

MIT License

---

Built with ❤️ by the SubPrompter team
