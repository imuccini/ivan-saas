export default function LaunchpadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Launchpad</h1>
        <p className="text-muted-foreground">
          Workspace overview and quick access dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Network Status</h3>
          <p className="text-sm text-muted-foreground mt-2">
            All systems operational
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Active Devices</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Connected devices overview
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Latest network events
          </p>
        </div>
      </div>
    </div>
  );
}
