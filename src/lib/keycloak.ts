import Keycloak from "keycloak-js";

const KEYCLOAK_URL =
	import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8180";
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || "orchestrix";
const KEYCLOAK_CLIENT_ID =
	import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "orchestrix-web";

export const keycloak = new Keycloak({
	url: KEYCLOAK_URL,
	realm: KEYCLOAK_REALM,
	clientId: KEYCLOAK_CLIENT_ID,
});

export async function initKeycloak(): Promise<boolean> {
	try {
		const authenticated = await keycloak.init({
			onLoad: "login-required",
			checkLoginIframe: false,
			pkceMethod: "S256",
		});

		if (authenticated) {
			// Set up token refresh
			setInterval(async () => {
				try {
					const refreshed = await keycloak.updateToken(60);
					if (refreshed) {
						console.debug("Token refreshed");
					}
				} catch {
					console.warn("Failed to refresh token, redirecting to login");
					keycloak.login();
				}
			}, 30000); // Check every 30 seconds
		}

		return authenticated;
	} catch (error) {
		console.error("Keycloak init error:", error);
		return false;
	}
}

export function getToken(): string | undefined {
	return keycloak.token;
}

export function isAuthenticated(): boolean {
	return keycloak.authenticated ?? false;
}

export function hasRole(role: string): boolean {
	return keycloak.hasRealmRole(role);
}

export function getUserInfo() {
	if (!keycloak.tokenParsed) return null;
	return {
		id: keycloak.tokenParsed.sub,
		email: keycloak.tokenParsed.email as string | undefined,
		name: keycloak.tokenParsed.name as string | undefined,
		tenantId: keycloak.tokenParsed.tenant_id as string | undefined,
		roles: keycloak.tokenParsed.realm_access?.roles || [],
	};
}

export function logout() {
	keycloak.logout({ redirectUri: window.location.origin });
}
