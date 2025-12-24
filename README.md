# Orchestrix Web

Frontend application for the Orchestrix platform.

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: TailwindCSS
- **State**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router
- **Validation**: Zod

## Project Structure (Feature-Based)

```
orchestrix-web/
├── src/
│   ├── app/              # App root, layout, providers
│   ├── features/         # Feature modules
│   │   ├── dashboard/    # Dashboard feature
│   │   ├── workflow/     # Workflow feature
│   │   ├── settings/     # Settings feature
│   │   └── auth/         # Auth feature
│   ├── components/       # Shared UI components
│   │   └── ui/           # Base UI components (shadcn-style)
│   ├── hooks/            # Shared hooks
│   ├── lib/              # Utilities (api, validators)
│   └── stores/           # Zustand stores
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Bun 1.0+

### Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint
bun run lint

# Format
bun run format
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | BFF API URL | `/api` (proxied to localhost:3000) |

## Features

- **Dashboard**: Overview of workflows and executions
- **Workflows**: List, create, and manage workflows
- **Executions**: Monitor workflow execution status
- **Settings**: User preferences and API keys

## Architecture

The frontend follows a **feature-based** structure:
- Each feature is self-contained (pages, components, hooks)
- Shared code is minimal and placed in `components/`, `hooks/`, `lib/`
- State management with Zustand for global state
- React Query for server state and caching

## License

MIT
