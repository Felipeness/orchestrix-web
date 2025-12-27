import { AuthProvider } from '@/features/auth/AuthContext';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { WorkflowDetailPage } from '@/features/workflow/WorkflowDetailPage';
import { WorkflowListPage } from '@/features/workflow/WorkflowListPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60, // 1 minute
			retry: 1,
		},
	},
});

export function App() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<DashboardPage />} />
							<Route path="workflows" element={<WorkflowListPage />} />
							<Route path="workflows/:id" element={<WorkflowDetailPage />} />
							<Route path="settings" element={<SettingsPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</AuthProvider>
	);
}
