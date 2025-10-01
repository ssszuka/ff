# Overview

Janvi Dreamer is a personal portfolio website for a gaming content creator and YouTuber from Madhya Pradesh, India. The site serves as a professional showcase featuring an interactive homepage with personal information, social media links, and a Discord verification portal. Built as a Multi-Page Application (MPA) with React and Vite, each page has its own HTML file and loads only the scripts and styles it needs for optimal performance and SEO.

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
- **Architecture Type**: Multi-Page Application (MPA) with separate HTML files per route
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Native navigation with anchor tags (no client-side routing)
- **Build System**: Vite multi-page build configuration with manual chunk splitting
- **State Management**: TanStack Query for server state and caching with React hooks for local state
- **Entry Points**: Separate entry files for each page (home.tsx, portal.tsx, notfound.tsx)

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
- **Multi-Page Architecture**: Each page has its own HTML file and loads only required scripts
- **Page-Specific Scripts**: Homepage loads AOS/GSAP animations; Portal and 404 pages don't (lighter bundles)
- **Manual Chunk Splitting**: Vendor libraries (289kB), page-specific chunks (home 16.9kB, portal 15.8kB, 404 2.8kB)
- **Separate Entry Points**: Each page has its own entry file that loads only needed components
- **SEO Optimized**: Each page has unique metadata, Open Graph tags, and JSON-LD structured data
- **Image Optimization**: WebP support with fallbacks
- **Animation Performance**: Animations only on homepage; reduced motion support
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