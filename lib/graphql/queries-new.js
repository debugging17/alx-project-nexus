import { graphql } from './generated';

export const GET_POSTS = graphql(`
  query GetPosts {
    postsCollection(orderBy: { created_at: DescNullsLast }, first: 20) {
      edges {
        node {
          id
          content
          created_at
          user_id
          users {
            id
            first_name
            last_name
            email
          }
        }
      }
    }
  }
`);

export const GET_USERS = graphql(`
  query GetUsers {
    usersCollection(first: 5) {
      edges {
        node {
          id
          first_name
          last_name
          email
        }
      }
    }
  }
`);
