# Practical 5 — Infinite scroll (TanStack Query + cursor pagination)

Two projects:

| Folder | Role |
|--------|------|
| **`tiktok-api/`** | Express + Prisma — **Part 1** backend (`videoController.js` cursor pagination) |
| **`tiktok-clone/`** | Next.js — **Part 2** frontend (`useInfiniteQuery`, Intersection Observer) |

## Quick start

**Terminal 1 — API**

```bash
cd tiktok-api
cp .env.example .env
npm install && npx prisma generate && npx prisma db push
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd tiktok-clone
# .env.local should include:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:5050/api
# NEXT_PUBLIC_API_ORIGIN=http://127.0.0.1:5050
npm install
npm run dev
```

Open http://127.0.0.1:3000 — scroll the For You feed; more videos load when the sentinel enters the viewport.

## What to submit / demo

- **Backend:** `getAllVideos` and `getFollowingVideos` use `cursor` + `limit`, Prisma `take: limit+1`, `skip: 1` after cursor, return `nextCursor` + `hasNextPage`.
- **Frontend:** `QueryClientProvider` in `app/providers.jsx`, `getVideosPage` / `getFollowingVideosPage` in `src/services/videoService.js`, `useIntersectionObserver` hook, `VideoFeed` with `useInfiniteQuery`.

Reference repos from the brief: [TikTok Frontend](https://github.com/syangche/TikTok_Frontend.git), [TikTok Server](https://github.com/syangche/TikTok_Server.git).
