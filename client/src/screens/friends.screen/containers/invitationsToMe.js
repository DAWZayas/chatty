import R from 'ramda';
import React from 'react';

import { Query } from 'react-apollo';

import { FRIEND_INVITATION_QUERY } from 'chatty/src/graphql/friend-invitation.query';

import { Friends } from '../components';

const FriendInvitationToMeContainer = props => (
  <Query query={FRIEND_INVITATION_QUERY} variables={{ userId: 1 }}>
    {({ data }) => (
      <Friends
        {...props}
        users={
          data.friendInvitations
            ? R.pluck('from', R.filter(({ to: { id } }) => id === 1, data.friendInvitations))
            : []
        }
      />
    )}
  </Query>
);

export default FriendInvitationToMeContainer;
