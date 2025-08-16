# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite blog frontend application with Vue Router, designed to consume a REST API backend. The application features a modern dark-themed interface for viewing blog articles with search, pagination, and routing capabilities.

## Tech Stack

- **Frontend Framework**: Vue 3 with Composition API (`<script setup>`) and TypeScript
- **Routing**: Vue Router 4 with history mode
- **Build Tool**: Vite 7.x
- **Styling**: TailwindCSS 4.x with @tailwindcss/vite plugin
- **HTTP Client**: Axios with interceptors for authentication

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Code Architecture

### Application Structure
- **App.vue**: Router outlet container (`<router-view />`)
- **src/router/index.js**: Vue Router configuration with routes for Home and ArticleDetail
- **src/components/Home.vue**: Main blog listing page with search, pagination, and featured articles
- **src/components/ArticleDetail.vue**: Individual article view page
- **src/services/api.js**: Axios-based API client with authentication and CRUD operations

### Routing
The application uses Vue Router with these routes:
- `/` - Home page (blog listing)
- `/article/:id` - Article detail by ID
- `/article/slug/:slug` - Article detail by slug
- Catch-all redirect to home for 404s

### API Integration
- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT tokens stored in localStorage with automatic header injection
- **Endpoints**: Articles, Categories, Analytics, Authentication, File Uploads
- **Error Handling**: Automatic token refresh and user feedback on failures

### Data Management
- Vue 3 Composition API with TypeScript
- Reactive state management for articles, categories, pagination
- Real-time search filtering by title and excerpt
- Featured article system (first published article)
- Client-side pagination with configurable page size

### Styling Approach
- TailwindCSS 4.x with dark theme (neutral-950, neutral-900 palette)
- Responsive design with mobile-first approach
- Custom CSS for line-clamping with `:deep()` selectors
- Backdrop blur effects and hover animations

## Key Features

1. **Article Listing**: Paginated grid layout with featured article section
2. **Article Detail**: Full article view with navigation and metadata
3. **Search**: Real-time filtering without API calls
4. **Authentication**: JWT-based auth with automatic token management
5. **Analytics**: View count tracking and like functionality
6. **File Uploads**: Thumbnail upload support
7. **Responsive Design**: Mobile-optimized interface

## API Service Structure

The `src/services/api.js` provides organized API methods:
- **auth**: login, logout, verify
- **articles**: CRUD operations, publish/archive
- **categories**: Category management
- **analytics**: View tracking, likes, dashboard data
- **uploads**: File upload and management