# Overview

Visionary AI is a modern AI tools platform that provides a comprehensive suite of AI-powered image generation and manipulation tools. The application is built as a full-stack TypeScript solution with a React frontend and Express.js backend, designed to offer users various AI capabilities including text-to-image generation, background removal, image upscaling, sketching, and image-to-image transformation.

The platform features a modern dark-themed UI with a sidebar navigation, community gallery, and floating action button for quick tool access. The application currently uses in-memory storage but is configured to support PostgreSQL database integration with Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing modern development patterns:
- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with custom dark theme variables and shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Architecture**: Modular component structure with reusable UI components

## Backend Architecture
The backend follows a RESTful API design pattern:
- **Server Framework**: Express.js with TypeScript
- **Development Environment**: Node.js 18+ with ESM modules
- **API Structure**: Centralized route registration with `/api` prefix
- **Error Handling**: Global error middleware for consistent error responses
- **Logging**: Custom request/response logging middleware

## Data Storage Solutions
The application uses a flexible storage abstraction:
- **Current Implementation**: In-memory storage using Map data structures
- **Database Ready**: Configured for PostgreSQL with Drizzle ORM
- **Schema Management**: Type-safe database schemas with Zod validation
- **Migration Support**: Drizzle Kit for database migrations

## Authentication and Authorization
Firebase Authentication integration provides comprehensive user management:
- **Provider**: Firebase Auth with email/password and Google OAuth
- **User Management**: Profile creation and management with display names
- **Session Handling**: Firebase token-based authentication
- **State Management**: React hooks for authentication state

## Component Design System
Comprehensive UI component library built on Radix UI primitives:
- **Design System**: shadcn/ui components with consistent styling
- **Theme System**: CSS variables for dark mode support
- **Typography**: Inter and Space Grotesk fonts for modern appearance
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

# External Dependencies

## Database and Storage
- **Drizzle ORM**: Type-safe database queries and schema management
- **PostgreSQL**: Primary database (via @neondatabase/serverless driver)
- **Drizzle Kit**: Database migration and introspection tools

## Authentication Services
- **Firebase Authentication**: User authentication and management
- **Google OAuth**: Social login integration
- **Firebase SDK**: Client-side authentication handling

## UI and Frontend Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation
- **TanStack React Query**: Server state management and caching

## Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Backend bundling for production
- **Replit Integration**: Development environment optimizations

## Third-party Integrations
- **Unsplash/Pixabay**: Stock images for gallery placeholder content
- **Google Fonts**: Web font loading for Inter and Space Grotesk
- **Social Media**: Links to Telegram, Twitter, Instagram, and Discord communities

The application is designed for easy deployment with a single production build process that creates both frontend assets and a bundled backend server, making it suitable for various hosting environments.