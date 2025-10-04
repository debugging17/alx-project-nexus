import { gql } from '@apollo/client';

export const GET_POSTS = gql`
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
`;

export const GET_USERS = gql`
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
`;
