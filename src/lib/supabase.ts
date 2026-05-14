import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createNullSupabase() {
  const empty = async () => ({ data: [], error: null });
  const single = async () => ({ data: null, error: null });

  // Chainable query builder that always returns empty
  const chainable = new Proxy({} as Record<string, () => unknown>, {
    get(_, key) {
      if (key === "then") return undefined; // prevent Promise-like behavior
      return () => chainable;
    },
  });

  const queryFn = () => ({
    ...chainable,
    select: () => queryFn(),
    insert: () => queryFn(),
    update: () => queryFn(),
    delete: () => queryFn(),
    eq: () => queryFn(),
    neq: () => queryFn(),
    in: () => queryFn(),
    or: () => queryFn(),
    ilike: () => queryFn(),
    order: () => queryFn(),
    limit: () => queryFn(),
    range: () => queryFn(),
    single: single,
    maybeSingle: single,
    then: (resolve: (v: unknown) => void) => resolve({ data: [], count: 0, error: null }),
  });

  return {
    from: () => queryFn(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  } as unknown as ReturnType<typeof createClient>;
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : createNullSupabase();

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
