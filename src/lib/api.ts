import { getToken } from "./keycloak";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export interface Workflow {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  definition: Record<string, unknown>;
  schedule?: string;
  status: "active" | "inactive" | "draft";
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: string;
  tenant_id: string;
  workflow_id: string;
  temporal_workflow_id?: string;
  temporal_run_id?: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_by?: string;
  created_at: string;
}

export interface DashboardStats {
  totalWorkflows: number;
  activeWorkflows: number;
  activeExecutions: number;
  successRate: number;
  avgDuration: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    throw new ApiError(response.status, response.statusText, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const workflows = await request<PaginatedResponse<Workflow>>("/workflows?limit=100");
      const activeWorkflows = workflows.data.filter(w => w.status === "active").length;

      return {
        totalWorkflows: workflows.total,
        activeWorkflows,
        activeExecutions: 0, // TODO: Get from executions endpoint
        successRate: 0,
        avgDuration: 0,
      };
    } catch {
      return {
        totalWorkflows: 0,
        activeWorkflows: 0,
        activeExecutions: 0,
        successRate: 0,
        avgDuration: 0,
      };
    }
  },

  // Workflows
  getWorkflows: (page = 1, limit = 20): Promise<PaginatedResponse<Workflow>> =>
    request<PaginatedResponse<Workflow>>(`/workflows?page=${page}&limit=${limit}`),

  getWorkflow: (id: string): Promise<ApiResponse<Workflow>> =>
    request<ApiResponse<Workflow>>(`/workflows/${id}`),

  createWorkflow: (data: {
    name: string;
    description?: string;
    definition: Record<string, unknown>;
    schedule?: string;
  }): Promise<ApiResponse<Workflow>> =>
    request<ApiResponse<Workflow>>("/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateWorkflow: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      definition: Record<string, unknown>;
      schedule: string;
      status: "active" | "inactive" | "draft";
    }>
  ): Promise<ApiResponse<Workflow>> =>
    request<ApiResponse<Workflow>>(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteWorkflow: (id: string): Promise<void> =>
    request<void>(`/workflows/${id}`, { method: "DELETE" }),

  executeWorkflow: (
    id: string,
    input?: Record<string, unknown>
  ): Promise<ApiResponse<Execution>> =>
    request<ApiResponse<Execution>>(`/workflows/${id}/execute`, {
      method: "POST",
      body: JSON.stringify({ input }),
    }),

  // Executions
  getExecution: (id: string): Promise<ApiResponse<Execution>> =>
    request<ApiResponse<Execution>>(`/executions/${id}`),

  getWorkflowExecutions: (
    workflowId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Execution>> =>
    request<PaginatedResponse<Execution>>(
      `/workflows/${workflowId}/executions?page=${page}&limit=${limit}`
    ),
};
