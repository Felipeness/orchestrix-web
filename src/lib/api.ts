const API_BASE = "/api/v1";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface Execution {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  result?: unknown;
}

interface DashboardStats {
  totalWorkflows: number;
  activeExecutions: number;
  successRate: number;
  avgDuration: number;
}

interface ApiResponse<T> {
  data: T;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboardStats: (): Promise<DashboardStats> =>
    // Mock data for now
    Promise.resolve({
      totalWorkflows: 12,
      activeExecutions: 3,
      successRate: 98.5,
      avgDuration: 1250,
    }),

  // Workflows
  getWorkflows: (): Promise<ApiResponse<Workflow[]>> =>
    request<ApiResponse<Workflow[]>>("/workflows"),

  getWorkflow: (id: string): Promise<ApiResponse<Workflow>> =>
    request<ApiResponse<Workflow>>(`/workflows/${id}`),

  createWorkflow: (data: { name: string; description?: string }): Promise<ApiResponse<Workflow>> =>
    request<ApiResponse<Workflow>>("/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  executeWorkflow: (id: string, params?: Record<string, string>): Promise<ApiResponse<Execution>> =>
    request<ApiResponse<Execution>>(`/workflows/${id}/execute`, {
      method: "POST",
      body: JSON.stringify({ params }),
    }),

  // Executions
  getExecution: (id: string): Promise<ApiResponse<Execution>> =>
    request<ApiResponse<Execution>>(`/executions/${id}`),
};
