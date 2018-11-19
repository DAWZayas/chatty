import R from 'ramda';
import React from 'react';

import { Query } from 'react-apollo';

import { BLACK_LIST_QUERY } from 'chatty/src/graphql/black-list.query';

import { Friends } from '../components';

const BlackListFromMeContainer = props => (
  <Query query={BLACK_LIST_QUERY} variables={{ userId: 1 }}>
    {({ data }) => (
      <Friends
        {...props}
        users={
          !data.blackList
            ? []
            : R.pluck(
              'from',
              R.filter(({ from: { id } }) => id === 1, data.blackList),
            )
        }
      />
    )}
  </Query>
);

export default BlackListFromMeContainer;
