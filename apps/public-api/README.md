# `public-api`

This is a minimal public API, demonstrating how API keys (generated in the dashboard) can be used to authenticate an organization.

## Pre-requisites

Make sure you have a `.env` with a valid `DATABASE_URL=<URL>`.

## Dev

To start the application, run:

```bash
pnpm --filter=public-api dev
```

Once the application is running, navigate to http://localhost:3002 in your browser to access the public API.

## Important Notes

- The internal dashboard API does not use API keys and instead relies on session-based authentication.
- If you don't need a public API, you can safely delete the `/apps/public-api` folder.
- In production this project may be deployed as `https://api.mydomain.com`.
- While Next.js can be used for public APIs (and Vercel even writes guides for that), we recommend using a dedicated framework like `Nest.js`, `Hono.js` or `Encore` for better functionality.
