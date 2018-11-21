import gql from 'graphql-tag';

export const CANCEL_FRIEND_INVITATION_MUTATION = gql`
  mutation cancelFriendInvitation($from: Int!, $to: Int!) {
    cancelFriendInvitation(from: $from, to: $to)
  }
`;

export default CANCEL_FRIEND_INVITATION_MUTATION;
