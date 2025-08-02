# AI Development Rules for Lucky Dip App

This document outlines the core technologies used in this project and provides guidelines for their appropriate use. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React:** The primary JavaScript library for building the user interface.
*   **TypeScript:** Used for type safety across the entire codebase, enhancing code quality and developer experience.
*   **Vite:** The build tool that provides a fast development environment and optimized production builds.
*   **React Router:** Manages client-side routing. All main application routes should be defined in `src/App.tsx`.
*   **Tailwind CSS:** The utility-first CSS framework for all styling. Prioritize Tailwind classes for layout, spacing, colors, and responsive design.
*   **shadcn/ui:** A collection of reusable UI components built with Radix UI and styled with Tailwind CSS.
*   **Lucide React:** Provides a set of beautiful, customizable React components for icons.
*   **Supabase:** Used for backend services, including Edge Functions (e.g., for the Play Assistant API) and potentially database interactions. API keys and secrets must be stored securely in Supabase secrets.
*   **React Query:** Manages server state, data fetching, caching, and synchronization.
*   **Sonner:** The preferred library for displaying toast notifications to the user.
*   **Framer Motion:** Utilized for declarative animations and transitions.
*   **localStorage:** Employed for client-side data persistence, such as wallet balance, jackpot amount, chat history, and queued numbers.

## Library Usage Guidelines

*   **React & TypeScript:** All new components and hooks must be written in TypeScript.
*   **Routing (`react-router-dom`):** Define all top-level routes within `src/App.tsx`. Avoid creating new routing logic outside of this file.
*   **UI Components (`shadcn/ui`):**
    *   Always prefer using existing `shadcn/ui` components when available.
    *   Do **not** modify `shadcn/ui` component files directly (e.g., files in `src/components/ui/`). If a component needs customization beyond its props, create a new component file (e.g., in `src/components/` or `src/features/`) and compose or extend the `shadcn/ui` component.
*   **Styling (`Tailwind CSS`):**
    *   All styling should be done using Tailwind CSS utility classes.
    *   Ensure designs are responsive by utilizing Tailwind's responsive prefixes (e.g., `md:`, `lg:`).
*   **Icons (`lucide-react`):** Use icons from `lucide-react` for all visual iconography.
*   **Backend & API (`Supabase`):**
    *   Any server-side logic, API calls, or sensitive operations (like using OpenAI API keys) must be handled via Supabase Edge Functions.
    *   Sensitive information (e.g., API keys) should be stored as Supabase secrets, not hardcoded in the client-side application.
*   **Data Fetching (`@tanstack/react-query`):** Use React Query for managing asynchronous data operations and caching.
*   **Toasts (`sonner`):** Implement all user notifications using the `sonner` toast system.
*   **Animations (`framer-motion`):** Use Framer Motion for any complex or interactive animations.
*   **Local Persistence (`localStorage`):** Store user-specific, non-sensitive data that needs to persist across sessions (e.g., wallet balance, jackpot, chat history) in `localStorage`.
*   **File Structure:**
    *   Place all source code within the `src` directory.
    *   Pages go into `src/pages/`.
    *   General-purpose components go into `src/components/`.
    *   Feature-specific logic, components, and hooks should be organized within `src/features/` (e.g., `src/features/timer/`, `src/features/wallet/`).
    *   Directory names must be all lowercase. File names can use mixed-case (e.g., `MyComponent.tsx`).
    *   Every new component or hook must be created in its own dedicated file, no matter how small. Avoid adding new components to existing files.