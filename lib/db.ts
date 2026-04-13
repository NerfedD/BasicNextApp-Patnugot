// lib/auth.ts
import { betterAuth, BetterAuthOptions } from "better-auth";
import { bearer } from "better-auth/plugins";
import { pool } from "./db";

// Dynamically resolve the base URL for Vercel environments
const getBaseURL = () => {
    if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
    if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.NODE_ENV === 'production' 
        ? 'https://basic-next-app-patnugot.vercel.app' 
        : 'http://localhost:3000';
};

export const authOptions = {
    // FIX: Cast as any to bypass the TypeScript mismatch between @types/pg 
    // and better-auth's expected Kysely options. The pg Pool is perfectly valid at runtime.
    database: pool as any,
    user: { 
        modelName: "users",
        additionalFields: {
            active: { type: "boolean" },
        },
    },
    session: { modelName: "sessions" },
    account: { modelName: "accounts" },
    verification: { modelName: "verifications" },
    emailAndPassword: { enabled: true },
    plugins: [bearer()],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: getBaseURL(), 
    trustedOrigins: [
        "http://localhost:3000",
        "https://basic-next-app-patnugot.vercel.app",
        "https://*.vercel.app" 
    ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);