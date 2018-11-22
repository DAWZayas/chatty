import gql from 'graphql-tag';

export const DELETE_FRIEND_MUTATION = gql`
  mutation deleteFriend($from: Int!, $to: Int!) {
    deleteFriend(from: $from, to: $to) {
      id
      friends {
        id
        username
      }
    }
  }
`;

export default DELETE_FRIEND_MUTATION;
