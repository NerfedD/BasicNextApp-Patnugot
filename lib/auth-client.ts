// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"; 
import { inferAdditionalFields } from "better-auth/client/plugins";
// FIX: Import ONLY from the new types file
import type { AuthOptions } from "./auth-types"; 

export const authClient = createAuthClient({
    // FIX: Always use current window origin in the browser
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