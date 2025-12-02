# Project Structure

## Directory Organization

```
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups for pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── loading.tsx        # Global loading component
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui component library
│   └── *.tsx             # Feature-specific components
├── lib/                  # Utility functions and services
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Additional stylesheets
```

## Key Conventions

### File Naming
- **Pages**: `page.tsx` in app directory structure
- **Components**: kebab-case (e.g., `product-card.tsx`)
- **Types**: `types.ts` for shared interfaces
- **Services**: `*-service.ts` for business logic
- **Utils**: `*-utils.ts` for helper functions

### Import Patterns
- Use `@/*` path alias for absolute imports from project root
- Components import UI components from `@/components/ui`
- Services and utilities from `@/lib`
- Types from `@/lib/types`

### Component Structure
- **UI Components**: Located in `components/ui/` (Shadcn/ui pattern)
- **Feature Components**: Root-level in `components/`
- **Provider Components**: Context providers for global state
- Use `"use client"` directive for client-side components

### State Management
- **Global State**: Context providers (Cart, Favorites, Auth, Theme)
- **Forms**: React Hook Form with Zod validation
- **Server State**: Direct API calls (no external state library)

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: For theme colors and design tokens
- **Component Variants**: Using `class-variance-authority` (cva)
- **Responsive Design**: Mobile-first approach

### Type Safety
- Strict TypeScript configuration
- Shared interfaces in `lib/types.ts`
- Props interfaces defined inline or exported from components
- Zod schemas for runtime validation

### Service Layer
- Business logic separated into service files (`lib/*-service.ts`)
- Mock data for development (`lib/mock-*.ts`)
- Utility functions in dedicated files (`lib/*-utils.ts`)