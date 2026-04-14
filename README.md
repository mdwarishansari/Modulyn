# Modulyn

> A multi-tenant, modular event operating platform.

Modulyn is a centralized event engine where organizations create events, add modules (quiz, hackathon, coding, etc.), manage participants and teams, run live rounds, and publish results — all from one system.

---

## Architecture

```
Modulyn/
├── client/        # Next.js frontend (App Router, TypeScript, Tailwind CSS)
├── server/        # Node.js + Express backend (TypeScript, Prisma, PostgreSQL)
├── shared/        # Shared types and constants (used by both client and server)
├── docs/          # Architecture docs, DB diagrams (git-ignored)
└── Plan/          # Original planning documents
```

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend   | Node.js, Express, TypeScript            |
| ORM       | Prisma                                  |
| Database  | PostgreSQL (NeonDB)                     |
| Auth      | JWT (access + refresh tokens)           |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL (or NeonDB connection string)
- pnpm / npm / yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/your-org/modulyn.git
cd modulyn
```

---

### 2. Setup the server

```bash
cd server
cp .env.example .env
# Fill in your DATABASE_URL and JWT secrets in .env
npm install
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run dev
```

Server runs on: `http://localhost:5000`

---

### 3. Setup the client

```bash
cd client
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL in .env.local
npm install
npm run dev
```

Client runs on: `http://localhost:3000`

---

## Scripts Reference

### Client (`/client`)

| Script        | Description                        |
|---------------|------------------------------------|
| `npm run dev` | Start Next.js dev server           |
| `npm run build` | Build production bundle          |
| `npm run lint` | Run ESLint                        |

### Server (`/server`)

| Script              | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start server with ts-node-dev      |
| `npm run build`     | Compile TypeScript to `/dist`      |
| `npm run start`     | Run compiled production server     |
| `npm run db:generate` | Generate Prisma client           |
| `npm run db:push`   | Push Prisma schema to database     |
| `npm run db:migrate` | Run Prisma migrations             |
| `npm run db:studio` | Open Prisma Studio                 |

---

## License

MIT