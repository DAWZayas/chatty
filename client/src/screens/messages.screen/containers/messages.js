import { graphql, compose } from 'react-apollo';

import GROUP_QUERY from 'chatty/src/graphql/group.query';
import CREATE_MESSAGE_MUTATION from 'chatty/src/graphql/create-message.mutation';

import { withLoading } from 'chatty/src/components/withLoading';

import Messages from '../components/messages';

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
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
            id: 1, // still faking the user
            username: 'Brook.Hudson', // still faking the user
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
          },
        });

          // Add our message from the mutation to the end.
        groupData.group.messages.unshift(createMessage);
        // Write our data back to the cache.
        store.writeQuery({
          query: GROUP_QUERY,
          variables: {
            groupId: message.groupId,
          },
          data: groupData,
        });
      },
    }),
  }),
});

export default compose(
  groupQuery,
  createMessageMutation,
  withLoading,
)(Messages);
