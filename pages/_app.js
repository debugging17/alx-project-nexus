import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';

export default function App({ Component, pageProps }) {
  if (!apolloClient) {
    return <Component {...pageProps} />;
  }
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
