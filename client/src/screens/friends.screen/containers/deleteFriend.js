import { graphql } from 'react-apollo';

import { DELETE_FRIEND_MUTATION } from 'chatty/src/graphql/delete-friend.mutation';
import { USER_QUERY } from 'chatty/src/graphql/user.query';

const deleteFriendMutation = graphql(DELETE_FRIEND_MUTATION, {
  props: ({ mutate }) => ({
    makeAction: to => mutate({
      variables: { to, from: 1 },
      refetchQueries: [
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

export default deleteFriendMutation;
