import { graphql, compose } from 'react-apollo';
import { USER_QUERY } from 'chatty/src/graphql/user.query';

import NewGroup from '../components/newGroup';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }), // fake for now
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default compose(userQuery)(NewGroup);
