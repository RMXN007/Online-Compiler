# CodeRunner - Multi-Language Runtime Environment

## Overview
A web-based multi-language code execution environment with dark mode support. Users can write and run code in multiple programming languages directly from the browser.

## Architecture

### Frontend
- **Framework**: React + TypeScript with Vite
- **Routing**: Wouter
- **UI**: Shadcn/UI components + Tailwind CSS
- **State**: TanStack Query v5
- **Theme**: Custom dark/light mode with localStorage persistence

### Backend
- **Server**: Express.js (Node.js)
- **Code Execution**: child_process.exec with temporary file creation
- **Storage**: In-memory (no persistent data needed)

## Key Features
- Multi-language support: JavaScript, TypeScript, C++, Python (if available), Bash
- Real code execution with stdout/stderr output
- Execution time measurement
- Code editor with line numbers, tab support, auto-indent
- Dark/light mode toggle
- Code snippets library
- Download and copy code functionality

## File Structure
```
client/src/
  App.tsx                    - Main app with routing and sidebar
  pages/
    editor.tsx               - Main code editor page
    snippets.tsx             - Code snippets library
    settings.tsx             - Theme and app settings
    not-found.tsx            - 404 page
  components/
    app-sidebar.tsx          - Navigation sidebar
    code-editor.tsx          - Code editor with line numbers
    theme-toggle.tsx         - Dark/light mode button
  hooks/
    use-theme.ts             - Theme state management
server/
  routes.ts                  - /api/execute endpoint
  index.ts                   - Express server setup
```

## API
- `POST /api/execute` - Execute code
  - Body: `{ code: string, language: "javascript" | "typescript" | "cpp" | "python" | "bash" }`
  - Response: `{ stdout, stderr, exitCode, executionTime, language }`

## Supported Languages
- **JavaScript** - Node.js 20
- **TypeScript** - tsx runner
- **C++** - GCC g++ compiler
- **Python** - python3 (if installed)
- **Bash** - Bash shell

## Design
- Dark-first IDE color scheme (deep blue-gray palette)
- JetBrains Mono / Fira Code for editor font
- VS Code-inspired layout with sidebar navigation
