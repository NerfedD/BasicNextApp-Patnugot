// scripts/test-db-connection.ts
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Force SSL configuration for Supabase connections
const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
};

console.log("ℹ️ Testing connection...");
const pool = new Pool(config);

(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('✅ Database time:', res.rows[0].now);
    client.release();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Database connection failed:', message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();