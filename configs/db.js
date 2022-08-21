import pg from 'pg';

// Database Connection
export const pool = new pg.Pool({
  user: 'postgres',
  host: 'db.jawezjhqjotikandcwbi.supabase.co',
  database: 'postgres',
  password: 'dococr2212!',
  port: 5432,
})