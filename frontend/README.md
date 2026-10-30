# SignalSafe Campus — Frontend (PWA)

React + TypeScript + Vite + Tailwind CSS frontend for **SignalSafe Campus**.

## Tech Stack

- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS v4**
- **React Router v7**
- **Recharts**

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```

The frontend will run on [http://localhost:5173](http://localhost:5173).

## Environment Variables

Configured in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application views (e.g., LandingPage)
│   ├── layouts/        # Page layouts and chrome
│   ├── services/       # Centralized API client and network calls
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript interface and type declarations
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Routing and root component
│   ├── main.tsx        # Application mount point
│   └── index.css       # Global styles and Tailwind imports
├── public/             # Static assets
├── package.json
└── vite.config.ts
```
