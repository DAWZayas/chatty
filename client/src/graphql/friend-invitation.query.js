import gql from 'graphql-tag';

// get all invitations related to an user
export const FRIEND_INVITATION_QUERY = gql`
  query friendInvitation($userId: Int!) {
    friendInvitations(userId: $userId) {
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

export default FRIEND_INVITATION_QUERY;
