import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabaseClient';

const __DEV__ = process.env.NODE_ENV !== 'production';

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const graphqlUrl = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isBrowser = typeof window !== 'undefined';

export function createApolloClient() {
  if (!graphqlUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn('[Apollo] Missing NEXT_PUBLIC_SUPABASE_GRAPHQL_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY; ApolloProvider will be skipped.');
    return null;
  }

  const httpLink = new HttpLink({
    uri: graphqlUrl,
    fetchOptions: { mode: 'cors' },
  });

  const authLink = setContext(async (_, { headers }) => {
    let token = supabaseAnonKey;

    if (isBrowser && supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        token = data?.session?.access_token ?? token;
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('[Apollo] Failed to resolve Supabase session for GraphQL requests.', error);
        }
      }
    }

    return {
      headers: {
        ...headers,
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: !isBrowser,
  });
}

export const apolloClient = createApolloClient();
