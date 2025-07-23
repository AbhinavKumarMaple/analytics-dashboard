# Real Estate Analytics Dashboard

A pixel-perfect real estate analytics dashboard built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Multiple dashboard views (Acquisition, Market, URLs)
- Interactive property map
- Data tables with sorting and filtering
- KPI cards and metrics display
- Authentication system
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query
- **Maps**: Leaflet/React Leaflet
- **Charts**: Recharts
- **Authentication**: NextAuth.js
- **Form Validation**: Zod
- **Code Quality**: ESLint, Prettier, Husky

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   │   ├── (routes)/       # Dashboard pages
│   │   │   ├── acquisition/# Acquisition view
│   │   │   ├── market/     # Market view
│   │   │   └── urls/       # URLs/Brands view
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── services/               # API services
└── types/                  # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Code Style

This project uses ESLint and Prettier for code formatting. You can run:

```bash
npm run lint
npm run format
```

### Git Hooks

Husky is configured to run linting and formatting before commits.

## Deployment

The application can be deployed to Vercel with the following steps:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## License

This project is private and confidential.
