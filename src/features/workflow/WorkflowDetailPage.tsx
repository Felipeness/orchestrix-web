import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

export function WorkflowDetailPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useQuery({
		queryKey: ["workflow", id],
		queryFn: () => api.getWorkflow(id!),
		enabled: !!id,
	});

	if (isLoading) {
		return <div className="animate-pulse">Loading workflow...</div>;
	}

	if (error) {
		return (
			<div className="text-destructive">
				Error loading workflow: {error.message}
			</div>
		);
	}

	const workflow = data?.data;

	if (!workflow) {
		return <div>Workflow not found</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link
					to="/workflows"
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					← Back to Workflows
				</Link>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{workflow.name}</h1>
					{workflow.description && (
						<p className="mt-1 text-muted-foreground">{workflow.description}</p>
					)}
				</div>
				<button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
					Execute
				</button>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Details</h2>
					<dl className="mt-4 space-y-4">
						<div>
							<dt className="text-sm text-muted-foreground">Status</dt>
							<dd className="mt-1">
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										workflow.status === "active"
											? "bg-green-100 text-green-700"
											: "bg-gray-100 text-gray-700"
									}`}
								>
									{workflow.status}
								</span>
							</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">Created</dt>
							<dd className="mt-1">
								{new Date(workflow.created_at).toLocaleString()}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-muted-foreground">Last Updated</dt>
							<dd className="mt-1">
								{new Date(workflow.updated_at).toLocaleString()}
							</dd>
						</div>
					</dl>
				</div>

				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Recent Executions</h2>
					<p className="mt-4 text-sm text-muted-foreground">
						No recent executions
					</p>
				</div>
			</div>
		</div>
	);
}
