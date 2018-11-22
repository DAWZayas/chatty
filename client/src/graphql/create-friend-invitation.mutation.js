import gql from 'graphql-tag';

export const CREATE_FRIEND_INVITATION_MUTATION = gql`
  mutation createFriendInvitation($invitation: CreateFriendInvitationInput!) {
    createFriendInvitation(invitation: $invitation) {
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

export default CREATE_FRIEND_INVITATION_MUTATION;
