# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure
- React application using Vite as build tool
- Frontend only (no backend/API)
- Uses React hooks (useState, useEffect)
- Styled with Tailwind CSS classes

## Code Style Guidelines
- Use functional components with React hooks
- Prefer const over let/var when variables won't be reassigned
- Use destructuring for props and state
- Follow camelCase naming for variables and functions
- Use clear, descriptive variable names
- Include meaningful comments for complex logic
- Handle errors with try/catch and console.error()
- Use optional chaining (?.) for potentially undefined values

## Formatting
- 2-space indentation
- Use semicolons
- Single quotes for strings
- Maintain consistent component structure

## Git Commit Guidelines
- All commits made by Claude should be attributed to Claude, not the human user
- Include the Claude emoji (🤖) in the commit message
- Add a "Co-Authored-By" line: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Use descriptive commit messages that explain the purpose of changes