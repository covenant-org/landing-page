import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key for admin operations)
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper functions to match existing db.ts interface
export async function query<T>(
  table: string,
  options?: {
    select?: string;
    filter?: { column: string; value: unknown }[];
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> {
  const client = createServerClient();
  let queryBuilder = client.from(table).select(options?.select || '*');

  if (options?.filter) {
    for (const f of options.filter) {
      queryBuilder = queryBuilder.eq(f.column, f.value);
    }
  }

  if (options?.order) {
    queryBuilder = queryBuilder.order(options.order.column, {
      ascending: options.order.ascending ?? true,
    });
  }

  if (options?.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }

  return (data as T[]) || [];
}

export async function queryOne<T>(
  table: string,
  options?: {
    select?: string;
    filter?: { column: string; value: unknown }[];
  }
): Promise<T | null> {
  const client = createServerClient();
  let queryBuilder = client.from(table).select(options?.select || '*');

  if (options?.filter) {
    for (const f of options.filter) {
      queryBuilder = queryBuilder.eq(f.column, f.value);
    }
  }

  const { data, error } = await queryBuilder.single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Supabase queryOne error:', error);
    throw error;
  }

  return (data as T) || null;
}

export async function insert<T>(
  table: string,
  data: Record<string, unknown>
): Promise<T> {
  const client = createServerClient();
  const { data: result, error } = await client
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  return result as T;
}

export async function update<T>(
  table: string,
  id: string,
  data: Record<string, unknown>
): Promise<T> {
  const client = createServerClient();
  const { data: result, error } = await client
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }

  return result as T;
}

export async function remove(table: string, id: string): Promise<void> {
  const client = createServerClient();
  const { error } = await client.from(table).delete().eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
}

// Raw SQL query support (for complex queries with joins)
export async function rawQuery<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const client = createServerClient();
  const { data, error } = await client.rpc('raw_sql', {
    query: sql,
    params: params || [],
  });

  if (error) {
    console.error('Supabase raw query error:', error);
    throw error;
  }

  return (data as T[]) || [];
}
