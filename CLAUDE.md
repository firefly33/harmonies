# React & TypeScript Coding Guidelines

## Core Principles

### React Rules of Hooks
- Only call hooks at the top level of React functions
- Don't call hooks inside loops, conditions, or nested functions
- Always use the same order of hooks in every component render

### Minimize useEffect Usage
- Prefer derived state over useEffect when possible
- Use event handlers instead of useEffect for user interactions
- Consider if state can be computed from props/other state instead of using useEffect

### Single Responsibility Principle
- Each component should have one clear purpose
- Extract complex logic into custom hooks when components become too large
- Keep components focused on rendering and user interaction

### Custom Hooks for Logic Extraction
- Extract stateful logic into custom hooks when components become complex
- Create reusable hooks for common patterns
- Separate business logic from UI concerns

### Mandatory Tanstack Query
- Use Tanstack Query (React Query) for all data fetching
- Leverage query invalidation and caching strategies
- Use mutations for data updates
- Take advantage of loading/error states provided by the library

### Service Layer Pattern
- Create dedicated service files for data fetching operations
- Place service files in a `services` directory
- Keep data fetching logic separate from hooks and components
- Use descriptive service names (e.g., `CardService.ts`, `UserService.ts`)
- Export functions that return Promises for async operations

### Test-First Approach
- Write tests before implementing components and hooks
- Start with failing tests that define the expected behavior
- Use Test-Driven Development (TDD) methodology
- Ensure tests cover edge cases and error scenarios
- Write meaningful test descriptions that document component behavior

## Version Control & Commit Guidelines

### Conventional Commits
- Follow conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Use present tense and imperative mood
- Keep subject line under 50 characters
- Examples:
  - `feat(auth): add login component`
  - `fix(api): handle error responses correctly`
  - `test(hooks): add unit tests for useGameState`

### Atomic Commit Policy
- Each commit should represent one logical change
- Avoid mixing unrelated changes in a single commit
- Ensure each commit can stand alone and doesn't break the build
- Commit frequently with small, focused changes
- Write clear commit messages that explain the "why", not just the "what"

## Implementation Guidelines
- Prefer composition over inheritance
- Use TypeScript strict mode
- Implement proper error boundaries
- Keep components pure when possible
- Use meaningful prop and state names