# Real Estate Analytics Dashboard - Design Document

## Overview

This design document outlines the technical architecture and implementation approach for building a pixel-perfect real estate analytics dashboard using Next.js 14, Tailwind CSS, and shadcn/ui. The application will replicate the provided Power BI dashboard wireframes with modern web technologies, focusing on responsive design, performance, and maintainability.

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Data Layer    │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (Mock JSON)   │
│                 │    │                 │    │                 │
│ - React 18      │    │ - API Routes    │    │ - Static Files  │
│ - Tailwind CSS  │    │ - Auth Handlers │    │ - Excel Data    │
│ - shadcn/ui     │    │ - Data Services │    │ - JSON Mocks    │
│ - Zustand       │    │ - Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**

- Next.js 14 (App Router)
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui for component library
- Zustand for state management
- React Query for data fetching
- Leaflet/MapBox for interactive maps
- Recharts for data visualizations
- Framer Motion for animations

**Backend:**

- Next.js API Routes
- NextAuth.js for authentication
- Zod for data validation
- JSON Web Tokens (JWT)

**Development Tools:**

- ESLint + Prettier
- Husky for git hooks
- TypeScript for type safety

## Components and Interfaces

### Core Layout Components

#### 1. AppLayout Component

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  user?: User;
}

// Features:
// - Responsive sidebar navigation
// - Top header with user profile
// - Main content area
// - Mobile-responsive hamburger menu
```

#### 2. Sidebar Navigation

```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
}

// Navigation Structure:
// - Data Analytics (parent)
//   - Market View
//   - Acquisition View
// - URLs
```

#### 3. Header Component

```typescript
interface HeaderProps {
  title: string;
  user: User;
  breadcrumbs?: BreadcrumbItem[];
}

// Features:
// - PANTHERA branding
// - Dynamic page titles
// - User avatar and profile dropdown
// - Notification bell
// - Settings icon
// - Dark/light mode toggle
```

### Dashboard Components

#### 1. Hero Banner Component

```typescript
interface HeroBannerProps {
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction: {
    label: string;
    onClick: () => void;
  };
}

// Styling:
// - Purple gradient background
// - Responsive text sizing
// - Call-to-action buttons
// - Background pattern/texture
```

#### 2. KPI Cards Component

```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  icon?: React.ComponentType;
}

// Features:
// - Responsive grid layout
// - Number formatting (commas, currency)
// - Trend indicators
// - Loading states
```

#### 3. Interactive Map Component

```typescript
interface MapProps {
  properties: PropertyLocation[];
  onPropertyClick: (property: PropertyLocation) => void;
  onPolygonDraw: (coordinates: LatLng[]) => void;
  filters: MapFilters;
}

interface PropertyLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  sqft: number;
  builder: string;
}

// Features:
// - Leaflet integration
// - Custom markers
// - Polygon drawing tools
// - Zoom controls
// - Layer toggles
// - Property popups
```

#### 4. Data Table Component

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  loading?: boolean;
}

// Features:
// - TanStack Table integration
// - Sortable columns
// - Search/filter functionality
// - Pagination
// - Loading skeletons
// - Responsive design
```

#### 5. Brand Cards Component

```typescript
interface BrandCardProps {
  name: string;
  logo?: string;
  backgroundColor: string;
  textColor: string;
  href: string;
}

// Features:
// - Responsive grid layout
// - Hover effects
// - Brand-specific styling
// - Click navigation
```

### Data Models

#### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "analyst" | "viewer";
}
```

#### Property Data Model

```typescript
interface Property {
  id: string;
  builder: string;
  lots: number;
  price: number;
  sqft: number;
  avgPricePerSqft: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: "active" | "sold" | "pending";
}
```

#### MSA Data Model

```typescript
interface MSAData {
  id: string;
  name: string;
  homesClosed: number;
  priceIncrease: number;
  salesPace: number;
  newHomesAdded: number;
  region: string;
}
```

#### Dashboard Metrics Model

```typescript
interface DashboardMetrics {
  totalLots: number;
  activeLots: number;
  avgPricePerSqft: number;
  totalSqftPlanned: number;
  salesPrice: number;
  priceIncrease: number;
}
```

## Error Handling

### Frontend Error Handling

```typescript
// Error Boundary Component
class DashboardErrorBoundary extends React.Component {
  // Handle React component errors
  // Display fallback UI
  // Log errors to monitoring service
}

// API Error Handling
interface APIError {
  message: string;
  code: string;
  status: number;
}

// Toast notifications for user feedback
// Retry mechanisms for failed requests
// Graceful degradation for non-critical features
```

### Backend Error Handling

```typescript
// API Route Error Handler
export function handleAPIError(error: unknown): NextResponse {
  // Log error details
  // Return appropriate HTTP status
  // Sanitize error messages for client
}

// Validation Error Handling
// Database connection error handling
// Authentication error handling
```

## Testing Strategy

### Unit Testing

- Component testing with React Testing Library
- Hook testing with @testing-library/react-hooks
- Utility function testing with Jest
- API route testing with Next.js test utilities

### Integration Testing

- End-to-end testing with Playwright
- API integration testing
- Authentication flow testing
- Data flow testing

### Visual Testing

- Storybook for component documentation
- Chromatic for visual regression testing
- Responsive design testing across devices

### Performance Testing

- Lighthouse CI for performance monitoring
- Bundle size analysis
- Core Web Vitals tracking
- Load testing for API endpoints

## Design System Implementation

### Color Palette

```css
:root {
  /* Primary Colors */
  --primary-purple: #8b5cf6;
  --primary-purple-dark: #7c3aed;

  /* Secondary Colors */
  --secondary-blue: #3b82f6;
  --secondary-green: #10b981;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Brand Colors */
  --kb-home: #f59e0b;
  --nvr: #991b1b;
  --lennar: #1e40af;
  --richmond: #dc2626;
}
```

### Typography Scale

```css
/* Headings */
.text-display: 3.75rem; /* 60px */
.text-h1: 3rem; /* 48px */
.text-h2: 2.25rem; /* 36px */
.text-h3: 1.875rem; /* 30px */
.text-h4: 1.5rem; /* 24px */
.text-h5: 1.25rem; /* 20px */
.text-h6: 1.125rem; /* 18px */

/* Body Text */
.text-lg: 1.125rem; /* 18px */
.text-base: 1rem; /* 16px */
.text-sm: 0.875rem; /* 14px */
.text-xs: 0.75rem; /* 12px */
```

### Spacing System

```css
/* Consistent spacing scale */
.space-1: 0.25rem; /* 4px */
.space-2: 0.5rem; /* 8px */
.space-3: 0.75rem; /* 12px */
.space-4: 1rem; /* 16px */
.space-5: 1.25rem; /* 20px */
.space-6: 1.5rem; /* 24px */
.space-8: 2rem; /* 32px */
.space-10: 2.5rem; /* 40px */
.space-12: 3rem; /* 48px */
.space-16: 4rem; /* 64px */
```

### Component Styling Guidelines

#### Cards

```css
.card {
  @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
}

.card-hover {
  @apply transition-all duration-200 hover:border-gray-300 hover:shadow-md;
}
```

#### Buttons

```css
.btn-primary {
  @apply rounded-md bg-primary-purple px-4 py-2 font-medium text-white;
  @apply transition-colors duration-200 hover:bg-primary-purple-dark;
}

.btn-secondary {
  @apply rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700;
  @apply transition-colors duration-200 hover:bg-gray-50;
}
```

#### Tables

```css
.table {
  @apply w-full border-collapse;
}

.table th {
  @apply bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500;
}

.table td {
  @apply whitespace-nowrap border-b border-gray-200 px-6 py-4 text-sm text-gray-900;
}

.table tr:hover {
  @apply bg-gray-50;
}
```

## Performance Optimizations

### Code Splitting

- Route-based code splitting with Next.js dynamic imports
- Component-level lazy loading for heavy components
- Vendor bundle optimization

### Image Optimization

- Next.js Image component for automatic optimization
- WebP format support with fallbacks
- Responsive image loading

### Data Loading

- React Query for efficient data fetching and caching
- Prefetching for anticipated user actions
- Optimistic updates for better UX

### Bundle Optimization

- Tree shaking for unused code elimination
- Dynamic imports for conditional features
- Bundle analyzer for size monitoring

## Responsive Design Strategy

### Breakpoint System

```css
/* Mobile First Approach */
.mobile: 0px; /* Default */
.tablet: 768px; /* md: */
.desktop: 1024px; /* lg: */
.wide: 1280px; /* xl: */
.ultra: 1536px; /* 2xl: */
```

### Layout Adaptations

- **Mobile (< 768px)**: Single column layout, hamburger navigation, stacked KPI cards
- **Tablet (768px - 1024px)**: Two-column layout, collapsible sidebar, grid adjustments
- **Desktop (> 1024px)**: Full multi-column layout, persistent sidebar, optimal spacing

### Component Responsiveness

- Flexible grid systems using CSS Grid and Flexbox
- Responsive typography with clamp() functions
- Adaptive component behavior based on screen size
- Touch-friendly interactions on mobile devices

## Security Considerations

### Authentication & Authorization

- JWT-based authentication with secure httpOnly cookies
- Role-based access control (RBAC)
- Session management and automatic token refresh
- Secure logout and session cleanup

### Data Protection

- Input validation and sanitization
- XSS protection with Content Security Policy
- CSRF protection for form submissions
- Secure API endpoint design

### Infrastructure Security

- HTTPS enforcement
- Environment variable protection
- Secure headers configuration
- Rate limiting for API endpoints

This design provides a comprehensive foundation for building a scalable, maintainable, and pixel-perfect real estate analytics dashboard that meets all the specified requirements while following modern web development best practices.
