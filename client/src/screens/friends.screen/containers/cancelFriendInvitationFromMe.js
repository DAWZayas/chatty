import { graphql } from 'react-apollo';

import { CANCEL_FRIEND_INVITATION_MUTATION } from 'chatty/src/graphql/cancel-friend-invitation.mutation';
import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';

const cancelFriendInvitationMutationFromMe = graphql(
  CANCEL_FRIEND_INVITATION_MUTATION,
  {
    props: ({ mutate }) => ({
      makeAction: to => mutate({
        variables: { to, from: 1 },
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

export default ActionComponent => cancelFriendInvitationMutationFromMe(ActionComponent);
