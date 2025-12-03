---
trigger: always_on
---

Dashboard Page Loading Strategy
Goal
Ensure all sidebar menu pages load immediately upon click, providing instant feedback to the user via a skeleton loader, rather than blocking navigation while fetching data on the server.

The Strategy: Client-Side Fetching with Skeletons
❌ Anti-Pattern: Blocking Server-Side Fetches
Do NOT use await to fetch data directly in the Page component (Server Component). This causes the browser to show a loading spinner (or the previous page) until the data is ready, making the app feel slow.

// ❌ BAD: Blocks navigation
export default async function DashboardPage() {
  const data = await fetchDashboardData(); // Blocks here
  return <DashboardView data={data} />;
}
✅ Correct Pattern: Client-Side Fetching
Use Client Components ("use client") and fetch data using TanStack Query (via ORPC hooks). This allows the page shell to render immediately.

// ✅ GOOD: Immediate navigation
"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@shared/lib/orpc-query-utils";
import { Skeleton } from "@ui/components/skeleton";
export default function DashboardPage() {
  // Fetch data on the client
  const { data, isLoading } = useQuery(
    orpc.dashboard.getData.queryOptions(...)
  );
  // Show skeleton while loading
  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }
  // Render actual content
  return <DashboardView data={data} />;
}
Implementation Checklist for New Pages
Mark page as "use client".
Use useQuery with ORPC hooks for data fetching.
Implement a Skeleton state that matches the final layout.
Ensure no await calls exist in the default export function.