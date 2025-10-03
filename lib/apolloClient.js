import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL; //https://kxcfqhmahmudbntyaith.supabase.co
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y2ZxaG1haG11ZGJudHlhaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTc3OTYsImV4cCI6MjA3NTA5Mzc5Nn0.enw5ROJTfTWjyJZ08BpuKwOtE3bfOH2Apu7NmN6q1lc
export function createApolloClient() {
  if (!graphqlUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn('[Apollo] Missing NEXT_PUBLIC_SUPABASE_GRAPHQL_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY; ApolloProvider will be skipped.');
    return null;
  }
  return new ApolloClient({
    link: new HttpLink({
      uri: graphqlUrl,
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      fetchOptions: { mode: 'cors' },
    }),
    cache: new InMemoryCache(),
  });
}

export const apolloClient = createApolloClient();
