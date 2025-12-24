import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getDashboardStats(),
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Workflows"
          value={stats?.totalWorkflows ?? 0}
        />
        <StatsCard
          title="Active Executions"
          value={stats?.activeExecutions ?? 0}
        />
        <StatsCard
          title="Success Rate"
          value={`${stats?.successRate ?? 0}%`}
        />
        <StatsCard
          title="Avg. Duration"
          value={`${stats?.avgDuration ?? 0}ms`}
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
