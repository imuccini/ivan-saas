---
trigger: model_decision
description: Performance optimization guidelines for Next.js App Router development
---

---
description: Performance optimization guidelines for Next.js App Router development
globs: 
alwaysApply: true
---

# Performance Guidelines for Next.js Development

This rule describes critical performance patterns and anti-patterns to follow when developing features in this Next.js application. These guidelines prevent common performance bottlenecks related to data fetching, layouts, and client-side hydration.

## 1. Layout Data Fetching Rules

### ❌ NEVER: Sequential Blocking Fetches in Layouts

**Anti-Pattern:**
```typescript
// DON'T: Sequential awaits block rendering
export default async function Layout() {
  const session = await getSession();
  const organizations = await getOrganizationList();
  const purchases = await getPurchases();
  
  return <div>{children}</div>;
}
```

**Why it's bad:** Each `await` blocks the entire UI rendering. With 3 nested layouts, this creates a 650-1200ms waterfall before ANY content is visible.

### ✅ DO: Parallel Data Fetching

**Correct Pattern:**
```typescript
// DO: Fetch in parallel with Promise.all
export default async function Layout() {
  const [session, organizations, purchases] = await Promise.all([
    getSession(),
    getOrganizationList(),
    getPurchases(),
  ]);
  
  return <div>{children}</div>;
}
```

**Impact:** Reduces blocking time by 400-600ms per navigation.

---

### ❌ NEVER: Duplicate Data Fetches Across Layout Hierarchy

**Anti-Pattern:**
```typescript
// Parent layout
export default async function ParentLayout() {
  const session = await getSession(); // First fetch
  return <div>{children}</div>;
}

// Child layout
export default async function ChildLayout() {
  const session = await getSession(); // DUPLICATE fetch!
  return <div>{children}</div>;
}
```

**Why it's bad:** Wastes 200-400ms per navigation with redundant database/API calls.

### ✅ DO: Access Cached Data from Parent Layouts

**Correct Pattern:**
```typescript
// Parent layout - fetch and prefetch
export default async function ParentLayout() {
  const session = await getSession();
  
  await queryClient.prefetchQuery({
    queryKey: sessionQueryKey,
    queryFn: () => session,
  });
  
  return <div>{children}</div>;
}

// Child layout - read from cache
export default async function ChildLayout() {
  const session = queryClient.getQueryData(sessionQueryKey);
  // OR rely on TanStack Query's cache in client components
  return <div>{children}</div>;
}
```

**Impact:** Eliminates 200-400ms of redundant blocking time.

---

### ❌ NEVER: Prefetch Non-Critical Data in Root Layouts

**Anti-Pattern:**
```typescript
// Root (saas)/layout.tsx
export default async function RootLayout() {
  // DON'T: Payments data not needed for all routes
  await queryClient.prefetchQuery(paymentsQueryKey, fetchPayments);
  
  return <div>{children}</div>;
}
```

**Why it's bad:** Forces ALL routes to wait for data only needed in specific pages.

### ✅ DO: Prefetch Data at the Closest Layout to Where It's Used

**Correct Pattern:**
```typescript
// [organizationSlug]/layout.tsx - only fetch where needed
export default async function OrgLayout({ params }) {
  const [organization] = await Promise.all([
    getActiveOrganization(params.organizationSlug),
    config.users.enableBilling
      ? queryClient.prefetchQuery(paymentsQueryKey, fetchPayments)
      : Promise.resolve(),
  ]);
  
  return <div>{children}</div>;
}
```

**Impact:** Reduces initial load by 200-400ms for routes that don't need the data.

---

## 2. Authentication & Session Management

### ❌ NEVER: Disable Cookie Cache Without Good Reason

**Anti-Pattern:**
```typescript
// DON'T: Forces fresh DB lookup on EVERY request
const session = await auth.api.getSession({
  headers: await headers(),
  query: {
    disableCookieCache: true, // ❌ AVOID
  },
});
```

**Why it's bad:** Adds 50-100ms overhead per request, even within the same render cycle.

### ✅ DO: Use Default Cookie Cache

**Correct Pattern:**
```typescript
// DO: Let auth library handle caching
const session = await auth.api.getSession({
  headers: await headers(),
  // Cookie cache enabled by default
});
```

**Note:** Only disable cookie cache if you have specific security requirements that demand fresh session validation on every request.

**Impact:** Reduces auth overhead by 50-100ms per request.

---

## 3. Client/Server Data Synchronization

### ❌ NEVER: Let Client Re-Fetch Server-Prefetched Data

**Anti-Pattern:**
```typescript
// Server: Prefetch in layout
await queryClient.prefetchQuery({
  queryKey: ['organization', slug],
  queryFn: () => fetchOrganization(slug),
});

// Client: Re-fetches because no staleTime configured
function ClientComponent() {
  const { data } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
    // ❌ Missing staleTime - will refetch immediately
  });
}
```

**Why it's bad:** Wastes 100-200ms with duplicate network calls.

### ✅ DO: Configure Appropriate staleTime and gcTime

**Correct Pattern:**
```typescript
// Server: Prefetch in layout
await queryClient.prefetchQuery({
  queryKey: ['organization', slug],
  queryFn: () => fetchOrganization(slug),
});

// Client: Uses prefetched data
function ClientComponent() {
  const { data } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes
    gcTime: 10 * 60 * 1000,   // ✅ 10 minutes
  });
}
```

**Impact:** Eliminates 100-200ms duplicate network calls.

---

## 4. Client Component Boundaries

### ❌ NEVER: Mark Entire Layout Providers as Client Components

**Anti-Pattern:**
```typescript
// DON'T: Forces entire subtree to be client-side
'use client';

export function DataProvider({ children }) {
  const data = useQuery(...); // Forces hydration of query library
  
  return (
    <Context.Provider value={data}>
      {children} {/* ALL children become client components */}
    </Context.Provider>
  );
}
```

**Why it's bad:** Adds 50-80KB to initial JS bundle, delays TTI by 200-400ms.

### ✅ DO: Split Server and Client Boundaries

**Correct Pattern:**
```typescript
// ServerProvider.tsx (Server Component)
export async function DataProvider({ children }) {
  const data = await fetchData(); // Server-side fetch
  
  return (
    <DataProviderClient initialData={data}>
      {children} {/* Can still be Server Components */}
    </DataProviderClient>
  );
}

// DataProviderClient.tsx (Client Component)
'use client';

export function DataProviderClient({ initialData, children }) {
  const data = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    initialData, // ✅ Use server data
    staleTime: 5 * 60 * 1000,
  });
  
  return <Context.Provider value={data}>{children}</Context.Provider>;
}
```

**Impact:** Reduces initial JS bundle by 50-80KB, improves TTI by 200-400ms.

---

## 5. Suspense Boundaries

### ❌ NEVER: Rely Only on Route-Level Loading.tsx

**Anti-Pattern:**
```typescript
// app/[org]/loading.tsx - only one boundary
export default function Loading() {
  return <FullPageSkeleton />;
}

// app/[org]/page.tsx
export default async function Page() {
  // Entire page waits for slowest fetch
  const [users, posts, analytics] = await Promise.all([
    fetchUsers(),    // 100ms
    fetchPosts(),    // 200ms
    fetchAnalytics(), // 800ms ← blocks everything
  ]);
  
  return <div>...</div>;
}
```

**Why it's bad:** User sees blank screen for 800ms instead of progressive content.

### ✅ DO: Add Granular Suspense Boundaries

**Correct Pattern:**
```typescript
// app/[org]/page.tsx
export default function Page() {
  return (
    <div>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersSection /> {/* 100ms */}
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection /> {/* 200ms */}
      </Suspense>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsSection /> {/* 800ms - doesn't block others */}
      </Suspense>
    </div>
  );
}
```

**Impact:** Improves perceived performance by 300-500ms through progressive rendering.

---

## 6. Heavy Client Dependencies

### ❌ NEVER: Import Heavy Libraries in Critical Path

**Anti-Pattern:**
```typescript
// DON'T: Loads 120KB library immediately
'use client';

import { useReactTable } from '@tanstack/react-table';

export function DataTable({ data }) {
  const table = useReactTable(...);
  return <div>...</div>;
}
```

**Why it's bad:** Adds 120KB to initial bundle, delays FCP by 100-200ms.

### ✅ DO: Lazy Load Heavy Components

**Correct Pattern:**
```typescript
// DO: Load table library on-demand
import dynamic from 'next/dynamic';

const DataTable = dynamic(
  () => import('./DataTable'),
  { 
    loading: () => <TableSkeleton />,
    ssr: false // If table doesn't need SSR
  }
);

export function Page() {
  return <DataTable data={data} />;
}
```

**Impact:** Reduces initial bundle by 120KB, improves FCP by 100-200ms.

---

## 7. API Request Deduplication

### ❌ NEVER: Allow Parallel Duplicate Requests

**Anti-Pattern:**
```typescript
// Component A
const { data } = useQuery(['user', id], fetchUser);

// Component B (rendered simultaneously)
const { data } = useQuery(['user', id], fetchUser);

// Result: 2 identical network requests fired in parallel
```

**Why it's bad:** Wastes bandwidth and server resources with duplicate calls.

### ✅ DO: Ensure Query Keys Match and Use Proper Cache Configuration

**Correct Pattern:**
```typescript
// Centralized query key factory
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};

// Component A
const { data } = useQuery({
  queryKey: userKeys.detail(id),
  queryFn: () => fetchUser(id),
  staleTime: 5 * 60 * 1000, // ✅ Prevents refetch
});

// Component B
const { data } = useQuery({
  queryKey: userKeys.detail(id), // ✅ Same key
  queryFn: () => fetchUser(id),
  staleTime: 5 * 60 * 1000,
});

// Result: Only 1 network request, shared across components
```

**Impact:** Reduces redundant API calls by 20-30%.

---

## 8. Conditional Data Fetching

### ❌ NEVER: Fetch Data You Might Not Need

**Anti-Pattern:**
```typescript
// DON'T: Always fetch payments, even if billing disabled
export default async function Layout() {
  const [session, payments] = await Promise.all([
    getSession(),
    fetchPayments(), // ❌ Fetched even if config.billing = false
  ]);
  
  return <div>{children}</div>;
}
```

**Why it's bad:** Wastes 100-200ms on unnecessary data fetches.

### ✅ DO: Conditionally Fetch Based on Feature Flags

**Correct Pattern:**
```typescript
// DO: Only fetch when feature is enabled
export default async function Layout() {
  const [session, payments] = await Promise.all([
    getSession(),
    config.users.enableBilling
      ? fetchPayments()
      : Promise.resolve(null), // ✅ Skip if disabled
  ]);
  
  return <div>{children}</div>;
}
```

**Impact:** Reduces unnecessary fetches, saves 100-200ms when features are disabled.

---

## 9. Cache Validation

### ❌ NEVER: Fetch Without Checking Cache First

**Anti-Pattern:**
```typescript
// DON'T: Always prefetch, even if data is fresh
export default async function Layout() {
  await queryClient.prefetchQuery({
    queryKey: ['data'],
    queryFn: fetchData, // ❌ Fetches even if already cached
  });
}
```

**Why it's bad:** Wastes network calls when data is already available.

### ✅ DO: Check Cache Before Prefetching

**Correct Pattern:**
```typescript
// DO: Only fetch if not in cache or stale
export default async function Layout() {
  const cachedData = queryClient.getQueryData(['data']);
  
  if (!cachedData) {
    await queryClient.prefetchQuery({
      queryKey: ['data'],
      queryFn: fetchData, // ✅ Only fetches when needed
    });
  }
}
```

**Impact:** Eliminates unnecessary refetches on navigation.

---

## Performance Checklist for New Features

Before submitting code, verify:

- [ ] **Layouts**: No sequential `await` calls - use `Promise.all()`
- [ ] **L