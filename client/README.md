# Modulyn — Client

> Next.js 16 · App Router · TypeScript · Tailwind CSS v4

---

## Folder Structure

```
client/
├── app/
│   ├── globals.css          # Design system: CSS variables + Tailwind v4 @theme tokens
│   ├── layout.tsx           # Root layout: fonts, metadata, theme FOUC script
│   └── page.tsx             # Homepage (placeholder)
├── components/
│   ├── ui/                  # Primitive design system components
│   │   ├── Button.tsx       # 5 variants × 3 sizes, loading, icon slots
│   │   ├── Input.tsx        # Label, error, helper, icon slots, ARIA
│   │   └── Card.tsx         # Compound Card.Header / .Body / .Footer
│   └── shared/              # Composed, reusable app components
│       ├── Logo.tsx         # Modulyn wordmark
│       ├── StateBadge.tsx   # Event/module lifecycle state badges
│       └── ThemeToggle.tsx  # System/light/dark cycle button
├── config/
│   └── index.ts             # App config (API URL, auth keys, pagination)
├── hooks/
│   └── useTheme.ts          # Class-based theme management, localStorage persistence
├── lib/
│   ├── api.ts               # Typed fetch client, auto-attaches auth headers
│   └── utils.ts             # cn(), formatDate(), slugify(), truncate()
├── types/
│   └── index.ts             # Shared TS types (API, auth, events, UI)
├── .env.example
├── .gitignore
└── README.md
```

---

## Theme System

Modulyn uses **class-based dark mode** (`.dark` on `<html>`).

- All colors are CSS custom properties in `globals.css`
- Tailwind utilities map to these vars via `@theme inline`
- No inline style hacks — every token has a semantic name

| Token              | Light               | Dark               |
|--------------------|---------------------|--------------------|
| `--bg-base`        | `#ffffff`           | `#0c0c10`          |
| `--bg-card`        | `#ffffff`           | `#16161f`          |
| `--accent-500`     | `#6366f1` (indigo)  | `#6366f1` (indigo) |
| `--state-live`     | `#dc2626` (red)     | `#ef4444` (red)    |
| `--state-reg-open` | `#16a34a` (green)   | `#22c55e` (green)  |

Toggle with `useTheme()`:

```ts
const { theme, setTheme } = useTheme();
setTheme("dark"); // "light" | "dark" | "system"
```

---

## Setup

```bash
cp .env.example .env.local
# → Set NEXT_PUBLIC_API_URL to match your backend

npm install
npm run dev
```

Client runs on: `http://localhost:3000`

---

## Using UI Components

```tsx
import { Button } from "@/components/ui/Button";
import { Input }  from "@/components/ui/Input";
import { Card }   from "@/components/ui/Card";

// Button variants: primary | secondary | outline | ghost | danger
<Button variant="primary" size="md" isLoading={false}>
  Create Event
</Button>

// Input with label + error
<Input
  label="Event Name"
  placeholder="Aayam 2025"
  errorMessage="Event name is required"
/>

// Composable Card
<Card hover bordered>
  <Card.Header>
    <Card.Title>Aayam 2025</Card.Title>
    <Card.Description>Annual technical fest</Card.Description>
  </Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

---

## Scripts

| Script          | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Start Next.js dev server         |
| `npm run build` | Production build                 |
| `npm run start` | Serve production build           |
| `npm run lint`  | Run ESLint                       |
