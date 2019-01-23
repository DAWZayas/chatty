import React from 'react';

import { Query } from 'react-apollo';
import { connect } from 'react-redux';

import { USER_QUERY } from 'chatty/src/graphql/user.query';

import { Groups } from '../components';

const mapStateToProps = ({ auth }) => ({
  auth,
});

const GroupsContainer = (props) => {
  const {
    auth: { id },
  } = props;
  return (
    <Query query={USER_QUERY} variables={{ id }}>
      {({ data, refetch, networkStatus }) => (
        <Groups {...props} {...data} refetch={refetch} networkStatus={networkStatus} />
      )}
    </Query>
  );
};

export default connect(mapStateToProps)(GroupsContainer);
