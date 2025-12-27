import { getToken, getUserInfo, hasRole, initKeycloak, keycloak, logout } from '@/lib/keycloak';
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface User {
	id?: string;
	email?: string;
	name?: string;
	tenantId?: string;
	roles: string[];
}

interface AuthContextValue {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	token: string | undefined;
	hasRole: (role: string) => boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		initKeycloak()
			.then((authenticated) => {
				setIsAuthenticated(authenticated);
				if (authenticated) {
					setUser(getUserInfo());
				}
			})
			.finally(() => {
				setIsLoading(false);
			});

		// Listen for auth state changes
		keycloak.onAuthSuccess = () => {
			setIsAuthenticated(true);
			setUser(getUserInfo());
		};

		keycloak.onAuthError = () => {
			setIsAuthenticated(false);
			setUser(null);
		};

		keycloak.onAuthRefreshSuccess = () => {
			setUser(getUserInfo());
		};

		keycloak.onTokenExpired = () => {
			keycloak.updateToken(60).catch(() => {
				keycloak.login();
			});
		};
	}, []);

	const value: AuthContextValue = {
		isAuthenticated,
		isLoading,
		user,
		token: getToken(),
		hasRole,
		logout,
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
