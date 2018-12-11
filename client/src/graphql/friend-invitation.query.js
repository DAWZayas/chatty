import gql from 'graphql-tag';

// get all invitations related to an user
export const FRIEND_INVITATION_QUERY = gql`
  query friendInvitation($userId: Int!) {
    friendInvitations(userId: $userId) {
      id
      from {
        id
        username
      }
      to {
        id
        username
      }
    }
  }
`;

export default FRIEND_INVITATION_QUERY;
