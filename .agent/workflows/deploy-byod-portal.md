---
description: How to deploy the BYOD Portal to Vercel
---

# Deploying apps/byodportal to Vercel

Since your project is a monorepo, you can deploy `apps/byodportal` as a separate project on Vercel while keeping it in the same repository.

## Steps

1.  **Go to Vercel Dashboard**: Log in to your Vercel account and click **"Add New..."** -> **"Project"**.
2.  **Import Repository**: Select your existing repository (`supastarter` or whatever it is named on GitHub/GitLab).
3.  **Configure Project**:
    *   **Project Name**: Give it a unique name, e.g., `byod-secure-portal`.
    *   **Framework Preset**: Vercel should auto-detect **Next.js**.
    *   **Root Directory**: Click "Edit" and select `apps/byodportal`. **This is the most important step.**
4.  **Build Settings**:
    *   Vercel usually auto-detects the build command for Turborepo.
    *   If needed, the Build Command is `cd ../.. && npx turbo run build --filter=byod-secure-portal`.
    *   However, with the Root Directory set, Vercel's default settings often work out of the box for Next.js in monorepos.
5.  **Environment Variables**:
    *   **Crucial for Shared DB**: You must add the same database connection strings used in your main project.
        *   `DATABASE_URL`: The connection string to your PostgreSQL database (e.g., from Supabase/Neon).
        *   `DIRECT_URL`: The direct connection string (if using Supabase/Neon with pooling).
    *   Add any other necessary environment variables (e.g., `NEXT_PUBLIC_API_URL` if you are calling your main API).
6.  **Deploy**: Click **"Deploy"**.

## Troubleshooting

If the build fails due to missing dependencies from the workspace:
- Ensure your `pnpm-lock.yaml` is up to date in the root.
- Vercel's "Root Directory" setting ensures it runs commands from that subdirectory but still has access to the root lockfile if configured correctly (Vercel handles monorepos automatically).
