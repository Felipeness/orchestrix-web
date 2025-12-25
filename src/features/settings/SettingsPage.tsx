import { useSettingsStore } from "@/stores/settings";

export function SettingsPage() {
	const { theme, setTheme } = useSettingsStore();

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Settings</h1>

			<div className="max-w-2xl space-y-6">
				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Appearance</h2>
					<div className="mt-4">
						<label className="text-sm font-medium">Theme</label>
						<select
							value={theme}
							onChange={(e) =>
								setTheme(e.target.value as "light" | "dark" | "system")
							}
							className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="system">System</option>
						</select>
					</div>
				</div>

				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Notifications</h2>
					<div className="mt-4 space-y-4">
						<label className="flex items-center gap-2">
							<input type="checkbox" className="rounded border-input" />
							<span className="text-sm">Email notifications</span>
						</label>
						<label className="flex items-center gap-2">
							<input type="checkbox" className="rounded border-input" />
							<span className="text-sm">Slack notifications</span>
						</label>
					</div>
				</div>

				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">API Keys</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Manage your API keys for programmatic access.
					</p>
					<button className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
						Generate New Key
					</button>
				</div>
			</div>
		</div>
	);
}
