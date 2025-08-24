# ElectroPap Monorepo

Apps:
- `apps/api`: Node.js Express + TypeScript API with Prisma and PostgreSQL
- `apps/web`: Next.js storefront (FR/EN) with cart, checkout
- `apps/mobile`: React Native (Expo) client

Packages:
- `packages/types`: Shared TypeScript types
- `packages/sdk`: API SDK client
- `packages/ui`: Shared UI components
- `packages/config`: Shared configs (ESLint, Prettier, tsconfig)

Infrastructure:
- Docker Compose with Postgres and Redis

## Getting Started

- Install: `npm install`
- Start DBs: `docker compose up -d`
- Dev API: `npm run dev -w apps/api`
- Dev Web: `npm run dev -w apps/web`

