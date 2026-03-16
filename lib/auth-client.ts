// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"; 
import { inferAdditionalFields } from "better-auth/client/plugins";
// Note: Only import types from lib/auth.ts to avoid "Unexpected token 'export'" errors
import type { AuthOptions } from "./auth"; 

export const authClient = createAuthClient({
    // FIX: Prioritize window.location.origin to prevent CORS/Fetch errors on Vercel
    baseURL: typeof window !== "undefined" 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    plugins: [
        inferAdditionalFields<AuthOptions>()
    ],
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => {
                if (typeof window !== "undefined") {
                    return sessionStorage.getItem("better-auth-token") || undefined;
                }
                return undefined;
            }
        },
        plugins: [
            {
                id: "auth-token-storage",
                name: "auth-token-storage",
                hooks: {
                    onResponse: async (context: { response: Response }) => {
                         const token = context.response.headers.get("set-auth-token");
                         if (token) {
                             sessionStorage.setItem("better-auth-token", token);
                         }
                    }
                }
            }
        ]
    }
});

export const { useSession, signIn, signUp, signOut, getSession } = authClient;