import { graphql } from './generated';

export const CREATE_POST = graphql(`
  mutation CreatePost($content: String!, $user_id: UUID!) {
    insertIntopostsCollection(objects: [{ content: $content, user_id: $user_id }]) {
      affectedCount
      records {
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
`);
