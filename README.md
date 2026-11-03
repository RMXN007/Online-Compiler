# Online Compiler (CodeRunner)

A web-based multi-language code execution environment and IDE built with React, Vite, Express, and CodeMirror 6. The application allows users to write, edit, and execute code directly in their browser across multiple programming languages, providing syntax highlighting, real-time stdout/stderr display, and execution timing metrics.

> **Related Architecture Document**: For a comprehensive architectural analysis, execution flow details, and the migration plan toward hosted remote code execution, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Supported Languages & Runtime Requirements](#supported-languages--runtime-requirements)
- [Technology Stack](#technology-stack)
- [Project Screenshots](#project-screenshots)
- [Prerequisites](#prerequisites)
- [Local Installation & Setup](#local-installation--setup)
- [Environment Variables](#environment-variables)
- [Compiler & Toolchain Setup Guide](#compiler--toolchain-setup-guide)
- [Running the Application](#running-the-application)
- [Using the Online Compiler](#using-the-online-compiler)
- [Common Setup Errors & Troubleshooting](#common-setup-errors--troubleshooting)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)

---

## Overview

Online Compiler (internally titled **CodeRunner**) is a single-server, full-stack application that couples an in-browser code editor with a local host-based execution runner. 

When a user writes code and presses **Run**, the code payload is transmitted to the backend Express server via a REST API call. The server temporarily writes the code to an OS temporary directory (`mkdtemp`), executes it using the host machine's installed compilers/interpreters via Node's `child_process.exec`, captures standard output (`stdout`), standard error (`stderr`), and the process exit code, and then immediately deletes the temporary directory before returning the execution results to the client.

---

## Key Features

- **Multi-Language Editing & Execution**: Write and execute JavaScript, TypeScript, C, C++, Python 3, and Bash/Shell.
- **Modern Code Editor**: Integrated [CodeMirror 6](https://codemirror.net/) with language-specific tokenizers, auto-closing brackets, line numbering, and bracket matching.
- **Theme Support**: Seamless Dark Mode (One Dark theme) and Light Mode switching with system preference detection and `localStorage` persistence.
- **Execution Telemetry**: Accurate roundtrip execution duration measurement (in milliseconds) and process exit codes (`0` for success, non-zero for failures/errors).
- **Dual Stream Output**: Separate tabs/panels displaying clean standard output (`stdout`) and formatted error traces (`stderr`).
- **Code Utilities**: Quick one-click actions in the editor toolbar:
  - **Copy**: Copies current editor contents to clipboard.
  - **Reset**: Restores default boilerplate template for the selected language.
  - **Download**: Downloads the code buffer as a language-appropriate source file (`.js`, `.ts`, `.c`, `.cpp`, `.py`, `.sh`).
  - **Clear**: Clears the editor canvas.
- **Pre-Built Code Snippets**: A dedicated Snippets library (`/snippets`) featuring runnable examples for quick reference and learning.
- **Settings & Environment Overview**: Visual status screen showing configured runtime environment details and editor configurations.

---

## Supported Languages & Runtime Requirements

The backend relies on the **host machine's local CLI tools** to compile and run code. Below are the execution parameters for each supported language:

| Language | Identifier (`language`) | File Extension | Compiler / Runner | Server Invocation Command | Local Host Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **JavaScript** | `javascript` | `.js` | Node.js | `node --harmony "code.js"` | Node.js v20+ |
| **TypeScript** | `typescript` | `.ts` | `tsx` CLI runner | `"node_modules/.bin/tsx" "code.ts"` | Included in `node_modules` |
| **C** | `c` | `.c` | GCC (GNU C Compiler) | `gcc -O2 -o "code" "code.c" -lm 2>&1`<br>then `"./code"` | `gcc` installed in system `PATH` |
| **C++** | `cpp` | `.cpp` | G++ (GNU C++ Compiler) | `g++ -O2 -o "code" "code.cpp" 2>&1`<br>then `"./code"` | `g++` installed in system `PATH` |
| **Python** | `python` | `.py` | Python 3 Interpreter | Detected via `which python3 \|\| which python`<br>then `python "code.py"` | `python3` or `python` in system `PATH` |
| **Bash** | `bash` | `.sh` | Bash Shell | `bash "code.sh"` | `bash` (Unix, macOS, or WSL/Git Bash on Windows) |

*Note: Stdin (interactive user input) is currently not supported in this version. Programs that wait for user input (e.g., `scanf`, `input()`, `cin`, `readline`) will block until the execution timeout expires (10s to 30s).*

---

## Technology Stack

### Frontend (Client)
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 4 / Tailwind Vite Plugin
- **Code Editor**: CodeMirror 6 (`codemirror`, `@codemirror/lang-cpp`, `@codemirror/lang-javascript`, `@codemirror/lang-python`, `@codemirror/legacy-modes/mode/shell`, `@codemirror/theme-one-dark`)
- **Routing**: [Wouter](https://github.com/molefrog/wouter) (lightweight declarative routing)
- **State Management & Caching**: TanStack React Query v5
- **UI & Styling**: Tailwind CSS, Shadcn/UI component primitives (Radix UI), Lucide React icons

### Backend (Server)
- **Runtime**: Node.js (ES Modules, target v20+)
- **Server Framework**: Express 5 (`express@^5.0.1`)
- **Execution Engine**: Node.js `child_process.exec` with `fs/promises` (`mkdtemp`, `writeFile`)
- **Input Validation**: Zod (`zod@^3.24.2`)
- **Build & Packaging**: `esbuild` for bundling the Node.js production server, `vite` for building client assets
- **Data Layer Scaffold**: Drizzle ORM (`drizzle-orm`, `pg`, `connect-pg-simple`) with in-memory fallback (`MemStorage`)

---

## Project Screenshots

*(Visual screenshots will be added once UI assets are captured and placed in the repository's public directory).*

---

## Prerequisites

Before setting up the project locally, ensure you have:

1. **Node.js**: Version 20.x or higher (LTS recommended).
   - Verify installation: `node -v`
2. **npm**: Version 9.x or higher (bundled with Node.js).
   - Verify installation: `npm -v`
3. **Git**: Version control client.
   - Verify installation: `git -v`

---

## Local Installation & Setup

Follow these steps to clone and run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/RMXN007/Online-Compiler.git
cd Online-Compiler
```

### 2. Install Project Dependencies
Run `npm install` in the project root directory:
```bash
npm install
```
This installs all client and server dependencies, including the CodeMirror language extensions, Radix UI modules, Vite, and `tsx`.

---

## Environment Variables

The application comes pre-configured with safe defaults and requires minimal environment configuration for local development.

Create a `.env` file in the project root if you need custom port binding:

```env
# Optional: Port on which the Express server and Vite client are served
# Default is 5000 if not specified
PORT=5000

# Optional: Database connection string (Only required if testing Drizzle DB features)
# DATABASE_URL=postgresql://user:password@localhost:5432/coderunner
```

---

## Compiler & Toolchain Setup Guide

Depending on which languages you plan to execute locally, ensure the relevant compilers and interpreters are available in your system `PATH`:

### 1. JavaScript & TypeScript
- **Prerequisite**: Node.js is already installed.
- **Setup**: Zero additional setup required. TypeScript execution is handled by project-local `node_modules/.bin/tsx`.

### 2. C & C++ (GCC & G++)
- **Windows**:
  - Install MinGW-w64 via [MSYS2](https://www.msys2.org/):
    ```bash
    pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
    ```
  - Add `C:\msys64\ucrt64\bin` to your Windows System `PATH`.
  - Alternatively, use Windows Subsystem for Linux (WSL).
- **macOS**:
  - Install Xcode Command Line Tools:
    ```bash
    xcode-select --install
    ```
- **Linux (Ubuntu/Debian)**:
  - Install standard build essentials:
    ```bash
    sudo apt update && sudo apt install -y build-essential
    ```

### 3. Python 3
- Ensure Python 3 is installed and added to your `PATH`.
- Verify by running `python3 --version` or `python --version`.
- If Python is absent, the backend safely returns a clear error message: *"Python 3 is not installed in this environment. Try JavaScript, TypeScript, C++, or Bash instead."*

### 4. Bash / Shell
- **Linux & macOS**: Included by default.
- **Windows**:
  - On native Windows Command Prompt or PowerShell, running bash scripts requires `bash.exe` in `PATH` (such as from Git for Windows: `C:\Program Files\Git\bin`) or running inside WSL.
  - If `bash` is not found, execution of shell scripts will return an error indicating the command was not found.

---

## Running the Application

### Development Mode

In development mode, a single command starts the integrated Express backend server and mounts Vite's hot-module-reloading (HMR) middleware:

```bash
npm run dev
```

- Express serves API routes on `/api/*` and delegates frontend requests directly to Vite's dev server.
- Open your browser and navigate to: `http://localhost:5000`

### Type Checking

To verify TypeScript types across client and server:
```bash
npm run check
```

### Production Build & Execution

To bundle the client with Vite and package the server using `esbuild`:

```bash
# 1. Compile client assets and bundle server
npm run build

# 2. Run the compiled production server
npm run start
```
- The production server serves the client bundle from `dist/public` and binds to `0.0.0.0:${PORT:-5000}`.

---

## Using the Online Compiler

1. **Select a Language**: Use the left sidebar to select your target programming language (e.g., C, C++, JavaScript, TypeScript, Python, or Bash).
2. **Write or Paste Code**: Use the central CodeMirror editor area to compose your source code. Default starter templates are pre-loaded.
3. **Execute Code**: Click the **Run** button (or press toolbar actions) in the upper right.
4. **Inspect Output**:
   - The lower Output panel expands automatically.
   - **Green Badge (Exit 0)**: Indicates successful execution. Output is displayed in standard white text.
   - **Red Badge (Exit 1+)**: Indicates compilation or runtime failure. Tracebacks or compiler diagnostic warnings appear highlighted under `stderr`.
   - **Execution Time**: Shows total execution duration in milliseconds (`ms`).
5. **Manage Code**:
   - Use **Copy** to copy the code to clipboard.
   - Use **Download** to save the code to your local machine as a file.
   - Use **Reset** to restore the default starter boilerplate.
   - Use **Clear** to wipe the canvas.

---

## Common Setup Errors & Troubleshooting

### 1. `NODE_ENV is not recognized as an internal or external command` (Windows)
- **Cause**: Windows CMD/PowerShell does not natively support inline POSIX environment variable syntax (`NODE_ENV=development`).
- **Fix**: The project uses `cross-env` in `package.json` (`npm run dev`). If you clone fresh, ensure dependencies are up-to-date with `npm install`.

### 2. `'gcc' or 'g++' is not recognized` / `exitCode: 127`
- **Cause**: GCC/G++ is not installed or its directory has not been added to your system's `PATH` environment variable.
- **Fix**: Install MinGW-w64 (Windows) or `build-essential` (Linux), verify with `gcc --version` in a new terminal window, and restart the dev server.

### 3. `Python 3 is not installed in this environment`
- **Cause**: Neither `python3` nor `python` could be resolved via `which` command.
- **Fix**: Install Python 3 from [python.org](https://www.python.org/) and ensure "Add Python to PATH" is checked during installation.

### 4. `rm: command not found` (Cleanup on Windows native cmd)
- **Cause**: The temporary directory cleanup logic in `server/routes.ts` issues `rm -rf "${dir}"`. On native Windows without POSIX tools in PATH, `rm` will fail silently in the `try/catch` block, leaving orphan temp folders in your OS temp directory (`%TEMP%\coderunner-*`).
- **Fix**: Run using WSL or ensure Git/Unix tools are in PATH. Moving to Node's native `rm(dir, { recursive: true, force: true })` solves this permanently.

---

## Current Limitations

1. **Host-Dependent Execution**: The server directly executes code on the host operating system without sandboxing, containerization, or jail restrictions.
2. **No Interactive Input (stdin)**: Programs requiring runtime user input (`cin`, `input()`, `scanf`) will hang until the server process hits the command timeout.
3. **No Container Isolation**: Code runs with the same operating system permissions as the Node.js server process.
4. **Execution Timeouts**: Hard execution limits are enforced:
   - JavaScript / Python / Bash / C execution / C++ execution: **10 seconds**
   - TypeScript execution: **15 seconds**
   - C / C++ Compilation: **30 seconds**
5. **In-Memory Storage**: The user and state storage layer uses `MemStorage`. Snippets and custom settings do not persist across database instances unless connected to PostgreSQL.

---

## Future Improvements

To transform this compiler into a robust, cloud-scalable development environment, the following architectural improvements are planned:

- **Remote Execution Engine (Judge0 Integration)**: Decouple code compilation and execution from the web server host to secure remote sandbox environments (Docker / Judge0).
- **Interactive Stdin Support**: Provide an interactive terminal or input tab in the UI allowing users to pass stdin inputs to programs.
- **Cloud Deployment**: Host the application frontend and backend on managed cloud platforms (e.g., Render, Vercel).
- **User Authentication & Saved Projects**: Support user accounts to save, fork, share, and version code snippets and projects.
- **Extended Language Matrix**: Add support for Java, Rust, Go, PHP, and Ruby.

*(For detailed architectural specifications and technical plans, refer to [ARCHITECTURE.md](ARCHITECTURE.md).)*
