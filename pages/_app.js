import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import ThemeToggle from '../components/ThemeToggle';

export default function App({ Component, pageProps }) {
  // If the Apollo client isn't available (e.g., missing env vars), render without it.
  if (!apolloClient) {
    return (
      <>
        <ThemeToggle />
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeToggle />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

