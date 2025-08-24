# AssuBot Mock Application

A React-based insurance management application with contract comparison, chatbot assistance, and comprehensive contract management features.

## Tech Stack

- **React** – UI library
- **TypeScript** – Strict type safety
- **Tailwind CSS** – Utility-first styling
- **Headless UI** – Accessible unstyled UI components
- **Redux Toolkit** – Global state management
- **React Hook Form** + **Zod** – Form handling and validation
- **React Router** – Routing
- **Fetch** – HTTP client with custom wrapper
- **Vite** – Frontend build tool
- **PNPM** – Package manager
- **Framer Motion** – Animation library
- **Chart.js** – Charting library

## API Setup

The application uses a custom fetch wrapper that supports multiple API connections with cookie-based authentication.

### Environment Variables

Copy `env.example` to `.env` and configure your API endpoints:

```bash
# API URLs
VITE_CORE_API_URL=http://localhost:3000/api/v1
VITE_AI_API_URL=http://localhost:3001/api/v1

# App Configuration
VITE_APP_NAME=AssuBot
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# Timeouts (in milliseconds)
VITE_API_TIMEOUT=10000
VITE_SESSION_TIMEOUT=3600000
```

### API Client Usage

The application provides two main API clients and service modules:

```typescript
// Core API (Business Logic)
import { coreApi } from '../services/api';
import { authService, contractsService, comparisonService, notificationsService, userService } from '../services/coreApi';

// AI API (AI/ML Services)
import { aiApi } from '../services/api';
import { chatService, analysisService, recommendationService, aiModelService } from '../services/aiApi';

// Example usage
const response = await authService.verify(token);
const contracts = await contractsService.getAll();
const chatResponse = await chatService.sendMessage({ content: 'Hello' });
```

### Custom Hook for API Calls

Use the `useApi` hook for components that need API integration:

```typescript
import { useApi } from '../hooks/useApi';
import { contractsService } from '../services/coreApi';

function MyComponent() {
  const { data, loading, error, execute } = useApi(contractsService.getAll);

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## Features

### Contract Management
- View and manage insurance contracts
- Detailed contract information with tabbed interface
- Document upload and management
- Contract creation with multi-step modal

### Contract Comparison
- Compare multiple insurance contracts
- Side-by-side analysis
- Historical comparison tracking

### Chatbot Integration
- AI-powered insurance assistance
- Real-time chat interface
- Context-aware responses

### User Profile & Notifications
- User profile management
- Notification system
- Account settings

## Development

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ContractsModule.tsx
│   ├── ContractDetailsPage.tsx
│   ├── CreateContractModal.tsx
│   └── ...
├── services/           # API services
│   ├── api.ts         # Fetch wrapper and API clients
│   ├── coreApi.ts     # Core API service modules
│   └── aiApi.ts       # AI API service modules
├── hooks/             # Custom React hooks
│   └── useApi.ts      # API integration hook
├── config/            # Configuration
│   └── env.ts         # Environment variables
├── store/             # Redux store
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## API Response Format

The application expects the following API response format:

```json
{
  "success": true,
  "data": {
    "message": "string",
    "resource": "any"
  }
}
```

Error responses should follow:

```json
{
  "status": "error",
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Authentication

The application uses cookie-based authentication. All API requests automatically include cookies via the `credentials: 'include'` option in the fetch wrapper.