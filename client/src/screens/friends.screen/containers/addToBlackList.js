import { graphql } from 'react-apollo';

import { ADD_TO_BLACK_LIST_MUTATION } from 'chatty/src/graphql/add-black-list.mutation';
import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';
import { USER_QUERY } from 'chatty/src/graphql/user.query';
import { BLACK_LIST_QUERY } from 'chatty/src/graphql/black-list.query';

const addToBlacklistMutation = graphql(ADD_TO_BLACK_LIST_MUTATION, {
  props: ({ mutate }) => ({
    makeAction: to => mutate({
      variables: { to, from: 1 },
      refetchQueries: [
        {
          query: BLACK_LIST_QUERY,
          variables: {
            userId: 1,
          },
        },
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
});

export default addToBlacklistMutation;
