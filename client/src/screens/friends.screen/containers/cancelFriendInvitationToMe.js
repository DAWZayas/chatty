import { graphql } from 'react-apollo';

import { CANCEL_FRIEND_INVITATION_MUTATION } from 'chatty/src/graphql/cancel-friend-invitation.mutation';
import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';

const cancelFriendInvitationMutationToMe = graphql(
  CANCEL_FRIEND_INVITATION_MUTATION,
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
        ],
      }),
    }),
  },
);

export default ActionComponent => cancelFriendInvitationMutationToMe(ActionComponent);
