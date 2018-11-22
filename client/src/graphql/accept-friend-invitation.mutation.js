import gql from 'graphql-tag';

export const ACCEPT_FRIEND_INVITATION_MUTATION = gql`
  mutation acceptFriendInvitation($from: Int!, $to: Int!) {
    acceptFriendInvitation(from: $from, to: $to) {
      username
      friends {
        username
      }
    }
  }
`;

export default ACCEPT_FRIEND_INVITATION_MUTATION;
