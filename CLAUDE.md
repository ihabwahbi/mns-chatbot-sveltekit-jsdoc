# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit chatbot application deployed to Azure Static Web Apps. It features a conversational AI interface with M&S EchoEngine, built with modern web technologies including Svelte 4, TailwindCSS, and TypeScript/JavaScript.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes copying custom staticwebapp.config.json)
- `npm run preview` - Preview production build locally
- `npm run lint` - Check code formatting with Prettier and ESLint
- `npm run format` - Auto-format code with Prettier
- `npm run check` - Type-check and sync SvelteKit

### Testing
- `npm test` - Run all tests (integration + unit)
- `npm run test:integration` - Run Playwright integration tests
- `npm run test:unit` - Run Vitest unit tests

## Architecture Overview

### Core Technologies
- **Framework**: SvelteKit with Azure Static Web Apps adapter (`svelte-adapter-azure-swa`)
- **Styling**: TailwindCSS with PostCSS
- **Build Tool**: Vite
- **Type Checking**: TypeScript with JSDoc annotations
- **UI Components**: Custom components in `src/lib/components/ui/` using bits-ui and svelte-radix

### Project Structure
- `src/routes/` - SvelteKit pages and routing
  - `+page.svelte` - Main chatbot interface with message handling and API integration
  - `+layout.svelte` - Layout wrapper
  - Components: Header, Menubar, AnimatedHamburger, Counter
- `src/lib/` - Shared library code
  - `components/ui/` - Reusable UI components (button, input, label, menubar, sheet, select)
  - `utils.ts` - Utility functions
- `tests/` - Playwright integration tests
- `src/routes/sverdle/` - Game feature with unit tests

### Key Features
1. **Chat Interface**: Real-time messaging with EchoEngine API
2. **Thread Management**: Persistent conversation threads using localStorage
3. **Markdown Support**: Message rendering with marked and DOMPurify
4. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
5. **Loading States**: Animated loading indicators during API calls

### API Integration
The application connects to an Azure Functions backend:
- Endpoint: `https://mns-chatbot-backend.azurewebsites.net/api/mns-chatbot-function`
- Request format: `{ prompt: string, threadId?: string }`
- Response format: `{ message: string, threadId: string }`

### Important Implementation Details
- Thread IDs are stored in localStorage and cleared on page refresh
- Messages are sanitized with DOMPurify before rendering
- Markdown content is parsed with the marked library
- Auto-scrolling to latest messages on new content
- Textarea auto-resizes based on content
- Enter key submits messages (Shift+Enter for new lines)

## Path Aliases
Configured in `svelte.config.js`:
- `utils` → `$lib/utils`
- `components` → `$lib/components`