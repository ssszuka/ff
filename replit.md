# Overview

Janvi Dreamer is a personal portfolio website for a gaming content creator and YouTuber from Madhya Pradesh, India. The site serves as a professional showcase featuring an interactive homepage with personal information, social media links, and a Discord verification portal. Built with React and modern web technologies using route-based code splitting for optimal multi-page performance, it emphasizes visual appeal with animations, dark/light theme support, and responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# Package Management Rules

**Important**: Always use `pnpm` for package management instead of `npm`. This includes:
- Installing packages: `pnpm install <package-name>`
- Installing dev dependencies: `pnpm install -D <package-name>`
- Running scripts: `pnpm run <script-name>`
- Installing all dependencies: `pnpm install`

Never use `npm install` or `npm` commands for this project.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing with React.lazy() for route-based code splitting
- **Build System**: Vite for fast development and optimized production builds with manual chunk splitting
- **State Management**: TanStack Query for server state and caching with React hooks for local state
- **Code Splitting**: Route-based lazy loading ensures each page loads independently with its own chunk

## UI and Styling
- **Design System**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Theming**: Dark/light mode support with CSS custom properties
- **Typography**: Google Fonts (Inter, Playfair Display, JetBrains Mono)
- **Animations**: Framer Motion for component animations, AOS for scroll animations, GSAP for interactive effects

## Data Management
- **Default Data System**: Centralized `/lib/default-data.ts` with modular exports for instant content display
- **Data Source**: Hybrid approach using instant default data with background API replacement
- **Loading Strategy**: Instant fallback display → background API loading → smooth data replacement
- **Caching**: 5-minute cache duration with automatic fallback to static data
- **Types**: Comprehensive TypeScript interfaces for data structures
- **Service Layer**: Centralized data service with error handling and cache management

## Component Structure
- **Layout**: Modular section-based components (Hero, About, Social, Footer)
- **UI Components**: Reusable Shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with optimized touch interactions
- **Instant Loading**: Default data displays immediately with smooth transitions when API data loads

## Performance Optimizations
- **Route-Based Code Splitting**: React.lazy() with Suspense for independent page loading
- **Manual Chunk Splitting**: Vendor libraries (290kB), route-specific chunks (homepage 16kB, portal 16kB, not-found 3kB)
- **Lazy Loading**: Each route loads only its required code and data on-demand
- **Image Optimization**: WebP support with fallbacks
- **Animation Performance**: Reduced motion support and mobile-optimized animations
- **Caching Strategy**: Service worker ready with static asset caching
- **Zero Loading Time**: Instant content display using centralized default data system

# External Dependencies

## Core Dependencies
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives for form controls, navigation, and overlays
- **@tanstack/react-query**: Server state management and caching solution
- **framer-motion**: Production-ready motion library for React animations
- **class-variance-authority**: Utility for creating component variants with TypeScript support
- **clsx** and **tailwind-merge**: Class name utilities for conditional styling

## Optional Integrations
- **Remote API**: Backend service for real-time Discord and YouTube data (disabled for static hosting)
- **AOS Library**: Animate On Scroll library loaded via CDN
- **GSAP**: GreenSock Animation Platform for advanced interactions
- **Google Fonts**: External font loading for typography
- **Font Awesome**: Icon library for social media and UI icons

## Static Assets
- Favicon package with multiple sizes and formats
- Fallback data JSON for offline functionality
- Custom CSS for page-specific styling
- Lottie animation player for interactive elements