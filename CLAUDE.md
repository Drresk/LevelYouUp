# LevelYouUp — Claude Code Context

## Project
Gamified personal assistant PWA — Next.js 14 (App Router), Supabase (PostgreSQL), Tailwind CSS, TypeScript.
Project root: `C:\Users\User\levelup`

## Design System Rules (ALWAYS follow)
- ALL cards: `.clay-card` class (claymorphism — double shadow, inner highlight, gradient bg)
- ALL buttons: `.clay-btn` + variant (`.clay-btn-purple`, `.clay-btn-gold`, etc.)
- NEVER flat design — every element needs perceived depth (shadows, gradients)
- Font: **Fredoka One** for display/headers, **Inter** for body, **JetBrains Mono** for numbers/stats
- Background: `#0D0D1A` (never white, never light)
- Border-radius: `24px` cards, `16px` buttons, `999px` badges/pills
- Clay color palette: purple `#6B2FD4`, gold `#F5A623`, cyan `#00D4FF`, emerald `#00C875`, crimson `#FF3B5C`

## Animation Rules
- Use **Framer Motion** for all transitions (installed ✅)
- Page transitions: 200ms ease-out, y offset + scale (PageTransition component in `/components/layout/`)
- List items: stagger 60ms, y:16 → y:0
- Numbers: always `<NumberTicker>` from `/components/magicui/`
- XP bars: spring animation, cubic-bezier(0.34, 1.56, 0.64, 1)
- Level-up screen: `<Confetti>` on mount + Framer Motion bounce

## Icon Rules
- NEVER use emoji — always `<PixelIcon icon="..." size={N} />`
- Icon definitions: `/components/ui/PixelIcon.tsx` (CSS grid of divs, not SVG)
- Size guide: `size={3}` nav tabs, `size={4}` cards, `size={6}` achievement cards, `size={8}` hero displays

## Chat Rules
- Chat bar ALWAYS visible — `<ChatBar />` in AppShell, pinned above nav tabs
- Quick action chips always visible (Gasto, Estudei, Água, Receita, Evento)
- AI responses: toast for simple (3s), bottom sheet for complex answers
- FloatingChatButton is REMOVED — replaced by ChatBar

## Financial Categories
- NEVER hardcode category names in app code
- Always load from `financial_categories` table for the current user
- Default categories are seeded on first login via `/api/financial/categories`
- `transactions.category_id` is a UUID FK to `financial_categories(id)`

## Database
- Supabase URL: https://huftrrdphibhrwswwlwj.supabase.co
- All tables have RLS enabled
- Migration files: `supabase/schema.sql` (base) + `supabase/migration_combined.sql` (run after)

## Component Libraries
- **shadcn/ui** — base components (`/components/ui/`) ✅
- **Custom MagicUI** — special effects (`/components/magicui/`) ✅ (BorderBeam, ShimmerButton, MagicCard, NumberTicker, AnimatedGradientText)
- **Custom ReactBits** — animated components (`/components/reactbits/`) (ShinyText, CountUp, GlowingCard)
- **Framer Motion** — all transitions and animations ✅
- **canvas-confetti** — level-up and achievement celebrations ✅

## Key Routes
- `/dashboard` — main screen (greeting + ChatBar + blocks)
- `/skills` — skill management + XP
- `/financeiro` — financial control with dynamic categories
- `/financeiro/categories` — category manager
- `/pomodoro` — Pomodoro timer
- `/calendario` — calendar
- `/chat` — full chat history
- `/feed` — social achievement feed
- `/shop` — in-game shop
- `/friends` — friends system
- `/profile` — user profile + avatar
- `/conquistas` — achievements
- `/challenges` — weekly challenges
- `/configuracoes` — settings

## API Structure
- `/api/chat` — AI chat routing (Groq Haiku → simple, Sonnet → analysis)
- `/api/financial` — CRUD transactions
- `/api/financial/categories` — CRUD financial categories
- `/api/skills` — CRUD skills
- `/api/pomodoro` — session recording + XP award
- `/api/profile` — profile + avatar management
- `/api/shop` — purchase flow
- `/api/water` — water logging
- `/api/friends` — friend system
- `/api/feed` — achievement feed
- `/api/challenges` — weekly challenges
- `/api/achievements` — achievement data
