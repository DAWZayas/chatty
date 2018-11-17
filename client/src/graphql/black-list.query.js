import gql from 'graphql-tag';

// get all black list related to an user
export const BLACK_LIST_QUERY = gql`
  query blackList($userId: Int!) {
    blackList(userId: $userId) {
      id
      from {
        username
      }
      to {
        username
      }
    }
  }
`;

export default BLACK_LIST_QUERY;
