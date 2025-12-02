# Technology Stack

## Framework & Runtime
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives
- **Shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **next-themes** - Theme switching (dark/light mode)

## State Management & Forms
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Context API** - Global state (Cart, Favorites, Auth)

## Backend Services
- **Appwrite** - Backend-as-a-Service (auth, database)
- **Resend** - Email service for order confirmations and notifications

## Data & File Handling
- **XLSX** - Excel file processing
- **date-fns** - Date manipulation

## Development Tools
- **ESLint** - Code linting (build errors ignored)
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Package Management
npm install          # Install dependencies
pnpm install         # Alternative package manager (pnpm-lock.yaml present)
```

## Build Configuration
- TypeScript and ESLint errors are ignored during builds for rapid prototyping
- Images are unoptimized for deployment flexibility
- Webpack build workers enabled for performance