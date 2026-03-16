// lib/auth.ts
import { betterAuth, BetterAuthOptions } from "better-auth";
import { bearer } from "better-auth/plugins";
import { pool } from "./db";

export const authOptions = {
    database: pool,
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
    baseURL: process.env.BETTER_AUTH_URL, 
    // FIX: Add your specific Vercel URL and allow preview branches
    trustedOrigins: [
        "http://localhost:3000",
        "https://basic-next-app-patnugot.vercel.app",
        "https://*.vercel.app" 
    ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);