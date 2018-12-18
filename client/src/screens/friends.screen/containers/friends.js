import React from 'react';

import { Query } from 'react-apollo';

import { USER_QUERY } from 'chatty/src/graphql/user.query';

import { Friends } from '../components';

const FriendsContainer = props => (
  <Query query={USER_QUERY} variables={{ id: 1 }}>
    {({ data }) => (
      <Friends {...props} users={data && data.user ? data.user.friends : []} />
    )}
  </Query>
);

export default FriendsContainer;
