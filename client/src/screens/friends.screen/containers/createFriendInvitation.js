import { graphql, compose } from 'react-apollo';

import { CREATE_FRIEND_INVITATION_MUTATION } from 'chatty/src/graphql/create-friend-invitation.mutation';
import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';

import CreateFriendInvitation from '../components/createFriendInvitation';

const friendInvitationQuery = graphql(FRIEND_INVITATION_QUERY, {
  options: () => ({ variables: { userId: 1 } }),
});

const createFriendInvitationMutation = graphql(
  CREATE_FRIEND_INVITATION_MUTATION,
  {
    props: ({ mutate }) => ({
      createFriendInvitation: invitation => mutate({
        variables: { invitation },
        update: (store, { data: { createFriendInvitation } }) => {
          const friendInvitationData = store.readQuery({
            query: FRIEND_INVITATION_QUERY,
            variables: {
              userId: invitation.from,
            },
          });

          friendInvitationData.friendInvitations.push(createFriendInvitation);

          store.writeQuery({
            query: FRIEND_INVITATION_QUERY,
            variables: {
              userId: invitation.from,
            },
            data: friendInvitationData,
          });
        },
      }),
    }),
  },
);

export default compose(
  friendInvitationQuery,
  createFriendInvitationMutation,
)(CreateFriendInvitation);
