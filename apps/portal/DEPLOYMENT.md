# Vercel Deployment Setup for Portal App

This document describes how to deploy the captive portal as a separate Vercel project while sharing the database with the admin app.

## Step 1: Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your repository (same as admin app)
4. Configure the project:

### Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `apps/portal` |
| Build Command | `cd ../.. && pnpm turbo run build --filter=@repo/portal` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |

### Environment Variables

Copy these from your admin app (they share the same database):

```
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

## Step 2: Configure Domain

1. Go to **Settings** → **Domains**
2. Add your portal domain: `portal.yourdomain.com`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `portal`
   - Value: `cname.vercel-dns.com`

## Step 3: Walled Garden Configuration

For captive portals to work, you must whitelist the portal domain in your WiFi controller:

### Meraki
```
Network-wide > Configure > Splash page
→ Walled garden > Add: portal.yourdomain.com
```

### Aruba
```
Configuration > AAA > Captive Portal
→ Walled Garden > Add Whitelist: portal.yourdomain.com
```

### Generic
Add these to your walled garden whitelist:
- `portal.yourdomain.com`
- Any image hosting domains (if using external storage)

## Step 4: Turbo Remote Cache (Optional)

For faster builds, enable Turbo remote caching:

```bash
pnpm turbo login
pnpm turbo link
```

## Step 5: Verify Deployment

After deployment, test your portal:

```bash
# Should show the portal
curl -I https://portal.yourdomain.com/test-workspace/default

# Should return 404
curl -I https://portal.yourdomain.com/invalid/invalid
```

## Monorepo Structure

```
supastarter/
├── apps/
│   ├── web/          # Admin Dashboard (app.yourdomain.com)
│   └── portal/       # Captive Portal (portal.yourdomain.com) ← NEW
├── packages/
│   ├── database/     # Shared Prisma client
│   └── portal-shared/ # Shared types ← NEW
```

## Cache Invalidation

When settings are updated in the admin app, call the portal's revalidation:

```typescript
// In admin app, after saving wizard config
import { revalidatePath } from 'next/cache';

// Trigger ISR revalidation
await fetch(`https://portal.yourdomain.com/api/revalidate`, {
  method: 'POST',
  headers: { 'x-revalidate-token': process.env.REVALIDATE_TOKEN },
  body: JSON.stringify({ workspace, instance })
});
```

## Local Development

Run both apps simultaneously:

```bash
# Terminal 1: Admin app on port 3000
pnpm --filter @repo/web dev

# Terminal 2: Portal app on port 3001
pnpm --filter @repo/portal dev
```

Or run both with Turbo:

```bash
pnpm turbo dev
```

## Troubleshooting

### Build fails: Cannot find module '@repo/database'
Make sure `transpilePackages` in `next.config.ts` includes all shared packages.

### Portal shows 404
1. Check that `GuestWifiConfig` exists with `isActive: true`
2. Verify workspace slug and instance name match exactly
3. Check database connection in Vercel environment variables

### Fonts not loading
Download and place Inter font files in `apps/portal/public/fonts/`:
- Inter-Regular.woff2
- Inter-Medium.woff2
- Inter-SemiBold.woff2
- Inter-Bold.woff2

Get them from: https://rsms.me/inter/
