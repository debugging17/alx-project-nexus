import dotenv from 'dotenv';
import type { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config({ path: '.env.local' });

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase URL or service role key is missing. Check .env.local.');
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`${NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`]: {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    },
  ],
  documents: ['pages/**/*.js', 'lib/graphql/**/*.js'],
  generates: {
    'lib/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;