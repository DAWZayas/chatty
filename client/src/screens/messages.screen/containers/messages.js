import R from 'ramda';
import { graphql, compose } from 'react-apollo';
import { Buffer } from 'buffer';
import { isBefore } from 'date-fns';

import GROUP_QUERY from 'chatty/src/graphql/group.query';
import CREATE_MESSAGE_MUTATION from 'chatty/src/graphql/create-message.mutation';
import { USER_QUERY } from 'chatty/src/graphql/user.query';
import { connect } from 'react-redux';

import { withLoading } from 'chatty/src/components/withLoading';

import Messages from '../components/messages';

const ITEMS_PER_PAGE = 10;
const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
      messageConnection: {
        first: ITEMS_PER_PAGE,
      },
    },
  }),
  props: ({
    data: {
      fetchMore, loading, group, subscribeToMore, refetch,
    },
  }) => ({
    loading,
    group,
    subscribeToMore,
    refetch,
    loadMoreEntries() {
      return fetchMore({
        // query: ... (you can specify a different query.
        // GROUP_QUERY is used by default)
        variables: {
          messageConnection: {
            first: ITEMS_PER_PAGE,
            after: group.messages.edges[group.messages.edges.length - 1].cursor,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // we will make an extra call to check if no more entries
          if (!fetchMoreResult) {
            return previousResult;
          }

          const edgesLens = R.lensPath(['group', 'messages', 'edges']);
          const pageInfoLens = R.lensPath(['group', 'messages', 'pageInfo']);

          const moreEdges = R.view(edgesLens, fetchMoreResult);

          // push results (older messages) to end of messages list
          return R.compose(
            R.set(pageInfoLens, R.view(pageInfoLens, fetchMoreResult)),
            R.over(edgesLens, xs => R.concat(xs, moreEdges)),
          )(previousResult);
        },
      });
    },
  }),
});

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate, ownProps }) => ({
    createMessage: message => mutate({
      variables: { message },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: -1, // don't know id yet, but it doesn't matter
          text: message.text, // we know what the text will be
          createdAt: new Date().toISOString(), // the time is now!
          from: {
            __typename: 'User',
            id: ownProps.auth.id,
            username: ownProps.auth.username,
          },
          to: {
            __typename: 'Group',
            id: message.groupId,
          },
        },
      },
      update: (store, { data: { createMessage } }) => {
        // Read the data from our cache for this query.
        const groupData = store.readQuery({
          query: GROUP_QUERY,
          variables: {
            groupId: message.groupId,
            messageConnection: { first: ITEMS_PER_PAGE },
          },
        });

          // Add our message from the mutation to the end.
        groupData.group.messages.edges.unshift({
          __typename: 'MessageEdge',
          node: createMessage,
          cursor: Buffer.from(createMessage.id.toString()).toString('base64'),
        });
        // Write our data back to the cache.
        store.writeQuery({
          query: GROUP_QUERY,
          variables: {
            groupId: message.groupId,
            messageConnection: { first: ITEMS_PER_PAGE },
          },
          data: groupData,
        });

        const userData = store.readQuery({
          query: USER_QUERY,
          variables: {
            id: ownProps.auth.id,
          },
        });

          // check whether the mutation is the latest message and update cache
        const updatedGroup = userData.user.groups.find(({ id }) => id === message.groupId);
        if (
          !updatedGroup.messages.edges.length
            || isBefore(updatedGroup.messages.edges[0].node.createdAt, createMessage.createdAt)
        ) {
          // update the latest message
          updatedGroup.messages.edges[0] = {
            __typename: 'MessageEdge',
            node: createMessage,
            cursor: Buffer.from(createMessage.id.toString()).toString('base64'),
          };
          // Write our data back to the cache.
          store.writeQuery({
            query: USER_QUERY,
            variables: {
              id: ownProps.auth.id,
            },
            data: userData,
          });
        }
      },
    }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupQuery,
  createMessageMutation,
  withLoading,
)(Messages);
