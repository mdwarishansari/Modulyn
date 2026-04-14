# Modulyn — Server

> Node.js + Express + TypeScript + Prisma + PostgreSQL (NeonDB)

---

## Folder Structure

```
server/
├── prisma/
│   └── schema.prisma          # Prisma schema (all core entities)
├── src/
│   ├── config/
│   │   └── env.ts             # Env loader + validator (fails fast on missing vars)
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middlewares/
│   │   ├── errorHandler.ts    # Global error handler + AppError class
│   │   ├── notFound.ts        # 404 catch-all
│   │   ├── requestLogger.ts   # Morgan HTTP logger
│   │   └── validate.ts        # Zod request validation middleware
│   ├── modules/               # Feature modules (routes + controller + service)
│   │   ├── auth/
│   │   ├── user/
│   │   ├── organization/
│   │   ├── event/
│   │   ├── module/
│   │   ├── registration/
│   │   └── submission/
│   ├── routes/
│   │   └── index.ts           # Root v1 router
│   ├── utils/
│   │   ├── asyncHandler.ts    # Wraps async handlers (no try/catch boilerplate)
│   │   └── response.ts        # Standardized JSON response helpers
│   ├── app.ts                 # Express app factory
│   └── server.ts              # Entry point — DB connect + listen + graceful shutdown
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env
# → Fill in DATABASE_URL (NeonDB), JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Start dev server
npm run dev
```

Server starts on: `http://localhost:5000`  
Health check: `GET http://localhost:5000/api/v1/health`

---

## API Response Shape

All endpoints return a consistent JSON shape:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "[{\"field\":\"email\",\"message\":\"Invalid email\"}]"
}
```

---

## Adding a New Module

1. Create `src/modules/{name}/` with:
   - `{name}.routes.ts`
   - `{name}.controller.ts`
   - `{name}.service.ts`
   - `{name}.schema.ts` (Zod schemas)
2. Mount the router in `src/routes/index.ts`
3. Add any new Prisma models to `prisma/schema.prisma`
4. Run `npm run db:generate`

---

## Scripts

| Script               | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start with ts-node-dev (hot reload)|
| `npm run build`      | Compile to `/dist`                 |
| `npm run start`      | Run compiled production build      |
| `npm run db:generate`| Generate Prisma client             |
| `npm run db:push`    | Push schema (dev, no migration)    |
| `npm run db:migrate` | Create tracked migration           |
| `npm run db:studio`  | Open Prisma Studio UI              |
| `npm run typecheck`  | Run `tsc --noEmit`                 |
