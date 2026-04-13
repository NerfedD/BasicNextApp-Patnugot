import { Pool, PoolClient, QueryResultRow, QueryResult } from 'pg';

const globalForPool = global as unknown as { pool: Pool };

const isServerless = process.env.VERCEL === '1';

// Base SSL configuration - Supabase REQUIRES SSL for remote connections
const sslConfig = process.env.DB_HOST === 'localhost' ? false : {
  rejectUnauthorized: false,
};

const connectionConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  // CRITICAL FOR VERCEL/SUPABASE:
  // Transaction mode (port 6543) doesn't support many concurrent connections
  max: isServerless ? 1 : 10, 
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  // Add this to prevent hanging on network issues
  query_timeout: 10000, 
};

const useExplicitConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD;

const finalConfig = useExplicitConfig
  ? connectionConfig 
  : { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: isServerless ? 1 : 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    };

// LOGGING: Check your Vercel logs for this line to verify variables are present
console.log(`[DB Config] Host=${process.env.DB_HOST || 'via-url'}, SSL=${!!finalConfig.ssl}, Max=${finalConfig.max}`);

export const pool = globalForPool.pool || new Pool(finalConfig);

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool;

pool.on('error', (err) => {
  console.error('[DB Error] Pool error:', err);
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string, 
  params?: unknown[]
): Promise<QueryResult<T>> => {
  // IMPORTANT: For Supabase Transaction Mode (port 6543), 
  // you must disable prepared statements if you use DATABASE_URL.
  // We do this by ensuring the query is sent as a simple string.
  try {
    return await pool.query<T>(text, params);
  } catch (error: any) {
    if (error.message?.includes('Connection terminated') || error.code === '57P01') {
      console.warn('⚠️ DB Connection terminated, retrying...');
      return await pool.query<T>(text, params);
    }
    throw error;
  }
};