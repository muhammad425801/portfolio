# Portfolio Website with Admin Panel

## Overview

This is a high-end, single-page portfolio website designed to showcase graphic design work with interactive storytelling elements and smooth animations. The application features a public portfolio interface and a private admin panel for content management. Built with modern web technologies, it emphasizes visual impact through dark elegant theming, WebGL animations, and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server:

- **Frontend**: React-based SPA using Vite as the build tool
- **Backend**: Express.js RESTful API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Styling**: TailwindCSS with shadcn/ui component library
- **Animation**: Framer Motion for smooth transitions and interactions
- **3D Graphics**: Three.js for WebGL background animations

### Directory Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configuration
├── server/              # Backend Express application
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Data access layer
│   └── vite.ts          # Development server setup
├── shared/              # Shared types and schemas
└── migrations/          # Database migration files
```

## Key Components

### Frontend Architecture

**UI Framework**: React with TypeScript for type safety and component composition. Uses functional components with hooks for state management.

**Styling System**: TailwindCSS provides utility-first styling with shadcn/ui components for consistent design patterns. Custom CSS variables enable dark theme implementation.

**State Management**: React Query (@tanstack/react-query) handles server state, caching, and synchronization. Local component state managed with React hooks.

**Routing**: Wouter provides lightweight client-side routing for navigation between home and admin sections.

**Animation Framework**: Framer Motion orchestrates page transitions, scroll-triggered animations, and interactive hover effects.

**3D Rendering**: Three.js creates WebGL-powered background animations with floating geometric shapes.

### Backend Architecture

**API Design**: RESTful Express.js server with JSON endpoints for portfolio items, contacts, and authentication.

**Data Layer**: Drizzle ORM provides type-safe database operations with PostgreSQL. Schema definitions shared between client and server.

**Authentication**: Session-based authentication using express-session with PostgreSQL session store. Simple username/password validation for admin access.

**Development Tools**: Vite integration for hot module replacement and development proxying.

### Database Schema

**Users Table**: Stores admin credentials (username, password)
**Portfolio Items Table**: Contains project data (title, description, category, images, metadata)
**Contacts Table**: Stores contact form submissions with project type classification

## Data Flow

1. **Public Portfolio**: Client fetches portfolio items via GET /api/portfolio
2. **Contact Form**: Submissions sent via POST /api/contacts
3. **Admin Authentication**: Login via POST /api/auth/login, establishes session
4. **Admin Operations**: CRUD operations on portfolio items require authentication
5. **Real-time Updates**: React Query automatically refetches data on mutations

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features
- **Express**: Node.js web framework for API server
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments

### UI and Animation Libraries
- **@radix-ui**: Accessible component primitives for complex UI elements
- **Framer Motion**: Production-ready motion library for React
- **Three.js**: Cross-browser JavaScript library for 3D graphics
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix and Tailwind

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for JavaScript
- **React Query**: Data fetching and caching library

## Deployment Strategy

**Build Process**: 
- Frontend builds to `dist/public` directory via Vite
- Backend bundles to `dist/index.js` via esbuild
- Both client and server code compile to ES modules

**Environment Configuration**:
- `DATABASE_URL` required for PostgreSQL connection
- Session configuration for production security
- Static file serving for built frontend assets

**Production Setup**:
- Express serves static files from built frontend
- Database migrations run via `npm run db:push`
- Node.js server starts with `npm start`

**Development Workflow**:
- `npm run dev` starts development server with hot reloading
- Vite proxy handles API requests during development
- TypeScript compilation checking via `npm run check`

The architecture prioritizes developer experience with type safety, fast development feedback, and clear separation of concerns while maintaining high performance for the end-user experience.