import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export function WorkflowListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => api.getWorkflows(),
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading workflows...</div>;
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading workflows: {error.message}
      </div>
    );
  }

  const workflows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Create Workflow
        </button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link
                    to={`/workflows/${workflow.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {workflow.name}
                  </Link>
                  {workflow.description && (
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      workflow.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {workflow.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-primary hover:underline">
                    Execute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
