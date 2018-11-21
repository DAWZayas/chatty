import { graphql } from 'react-apollo';

import { ACCEPT_FRIEND_INVITATION_MUTATION } from 'chatty/src/graphql/accept-friend-invitation.mutation';
import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';
import { USER_QUERY } from 'chatty/src/graphql/user.query';

const acceptFriendInvitationMutation = graphql(
  ACCEPT_FRIEND_INVITATION_MUTATION,
  {
    props: ({ mutate }) => ({
      makeAction: from => mutate({
        variables: { to: 1, from },
        refetchQueries: [
          {
            query: FRIEND_INVITATION_QUERY,
            variables: {
              userId: 1,
            },
          },
          {
            query: USER_QUERY,
            variables: {
              id: 1,
            },
          },
        ],
      }),
    }),
  },
);

export default ActionComponent => acceptFriendInvitationMutation(ActionComponent);
