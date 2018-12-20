import React from 'react';

import { Query } from 'react-apollo';

import { USER_QUERY } from 'chatty/src/graphql/user.query';

import { Groups } from '../components';

const GroupsContainer = props => (
  <Query query={USER_QUERY} variables={{ id: 1 }}>
    {({ data, refetch, networkStatus }) => (
      <Groups {...props} {...data} refetch={refetch} networkStatus={networkStatus} />
    )}
  </Query>
);

export default GroupsContainer;
