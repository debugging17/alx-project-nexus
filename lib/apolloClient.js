import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
