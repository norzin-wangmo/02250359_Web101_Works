# Practical 5 — Backend (cursor pagination)

Express API for infinite scroll. **Controllers** hold request logic; **routes** only wire URLs.

## Structure

```
src/
  controllers/
    videoController.js   ← getAllVideos, getFollowingVideos (cursor + n+1)
    userController.js
  routes/
    videoRoutes.js
    userRoutes.js
  middleware/authMiddleware.js
  index.js
```

## Cursor API

| Endpoint | Query | Response |
|----------|--------|----------|
| `GET /api/videos` | `limit`, `cursor?` | `{ videos, nextCursor, hasNextPage, pagination }` |
| `GET /api/videos/following` | same (auth) | same |

## Run

```bash
cd Practical_Works/Practical_5/tiktok-api
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Pair with `../tiktok-clone` — set matching hosts in `.env` and `.env.local`.
