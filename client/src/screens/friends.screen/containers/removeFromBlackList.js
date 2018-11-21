import { graphql } from 'react-apollo';

import { REMOVE_FROM_BLACK_LIST_MUTATION } from 'chatty/src/graphql/remove-from-black-list.mutation';
import { BLACK_LIST_QUERY } from 'chatty/src/graphql/black-list.query';

const removeFromBlacklistMutation = graphql(REMOVE_FROM_BLACK_LIST_MUTATION, {
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
      ],
    }),
  }),
});

export default removeFromBlacklistMutation;
