import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;

// Query helper - executes raw SQL via Supabase's pg_query function (if available)
// or falls back to using the REST API with table queries
export async function query<T>(
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params?: unknown[]
): Promise<T[]> {
  // Parse the SQL to determine the table and operation
  const tableName = extractTableName(sql);

  if (!tableName) {
    throw new Error('Could not determine table name from SQL query');
  }

  // For SELECT queries, use the REST API
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return (data as T[]) || [];
  }

  throw new Error('Only SELECT queries are supported via this method');
}

export async function queryOne<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const tableName = extractTableName(sql);

  if (!tableName) {
    throw new Error('Could not determine table name from SQL query');
  }

  // Handle INSERT queries
  if (sql.trim().toUpperCase().startsWith('INSERT')) {
    const columns = extractInsertColumns(sql);
    const data: Record<string, unknown> = {};

    if (columns && params) {
      columns.forEach((col, index) => {
        data[col] = params[index];
      });
    }

    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return result as T;
  }

  // Handle UPDATE queries
  if (sql.trim().toUpperCase().startsWith('UPDATE')) {
    const setClause = extractUpdateSetClause(sql);
    const idParam = params?.[params.length - 1]; // Assume last param is ID
    const data: Record<string, unknown> = {};

    if (setClause && params) {
      setClause.forEach((col, index) => {
        data[col] = params[index];
      });
    }

    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', idParam)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    return result as T;
  }

  // Handle SELECT queries with WHERE clause
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    // Check for WHERE id = condition
    if (sql.includes('WHERE') && params && params.length > 0) {
      const whereColumn = extractWhereColumn(sql);

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(whereColumn, params[0])
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase queryOne error:', error);
        throw error;
      }

      return (data as T) || null;
    }

    // Simple select
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase queryOne error:', error);
      throw error;
    }

    return (data as T) || null;
  }

  // Handle DELETE queries
  if (sql.trim().toUpperCase().startsWith('DELETE')) {
    const idParam = params?.[0];

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', idParam);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return null;
  }

  throw new Error('Unsupported query type');
}

// Helper function to extract table name from SQL
function extractTableName(sql: string): string | null {
  const upperSql = sql.toUpperCase();

  // FROM table_name
  let match = upperSql.match(/FROM\s+(\w+)/i);
  if (match) return match[1].toLowerCase();

  // INSERT INTO table_name
  match = upperSql.match(/INSERT\s+INTO\s+(\w+)/i);
  if (match) return match[1].toLowerCase();

  // UPDATE table_name
  match = upperSql.match(/UPDATE\s+(\w+)/i);
  if (match) return match[1].toLowerCase();

  // DELETE FROM table_name
  match = upperSql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (match) return match[1].toLowerCase();

  return null;
}

// Helper function to extract columns from INSERT statement
function extractInsertColumns(sql: string): string[] | null {
  const match = sql.match(/\(([^)]+)\)\s*VALUES/i);
  if (match) {
    return match[1].split(',').map(col => col.trim().toLowerCase());
  }
  return null;
}

// Helper function to extract SET columns from UPDATE statement
function extractUpdateSetClause(sql: string): string[] | null {
  const match = sql.match(/SET\s+(.+?)\s+WHERE/i);
  if (match) {
    const setClause = match[1];
    const columns = setClause.split(',').map(part => {
      const col = part.split('=')[0].trim().toLowerCase();
      return col;
    });
    return columns;
  }
  return null;
}

// Helper function to extract WHERE column
function extractWhereColumn(sql: string): string {
  const match = sql.match(/WHERE\s+(\w+\.)?(\w+)\s*=/i);
  if (match) {
    return match[2].toLowerCase();
  }
  return 'id';
}
