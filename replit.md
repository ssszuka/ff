# Overview

Janvi Dreamer is a personal portfolio website for a gaming content creator and YouTuber from Madhya Pradesh, India. The site serves as a professional showcase featuring an interactive homepage with personal information, social media links, and a Discord verification portal. Built as a single-page application with React and modern web technologies, it emphasizes visual appeal with animations, dark/light theme support, and responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Build System**: Vite for fast development and optimized production builds
- **State Management**: TanStack Query for server state and caching with React hooks for local state

## UI and Styling
- **Design System**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Theming**: Dark/light mode support with CSS custom properties
- **Typography**: Google Fonts (Inter, Playfair Display, JetBrains Mono)
- **Animations**: Framer Motion for component animations, AOS for scroll animations, GSAP for interactive effects

## Data Management
- **Data Source**: Hybrid approach using local fallback data and optional remote API
- **Caching**: 5-minute cache duration with automatic fallback to static data
- **Types**: Comprehensive TypeScript interfaces for data structures
- **Service Layer**: Centralized data service with error handling and cache management

## Component Structure
- **Layout**: Modular section-based components (Hero, About, Social, Footer)
- **UI Components**: Reusable Shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with optimized touch interactions
- **Loading States**: Custom loading screens and skeleton components

## Performance Optimizations
- **Bundle Splitting**: Vite's automatic code splitting
- **Image Optimization**: WebP support with fallbacks
- **Animation Performance**: Reduced motion support and mobile-optimized animations
- **Caching Strategy**: Service worker ready with static asset caching

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