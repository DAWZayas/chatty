import R from 'ramda';
import React, { Component } from 'react';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';

import { withLoading } from 'chatty/src/components/withLoading';

import { graphql } from 'react-apollo';
import { USER_QUERY } from 'chatty/src/graphql/user.query';
import MESSAGE_ADDED_SUBSCRIPTION from 'chatty/src/graphql/message-added.subscription';
import GROUP_ADDED_SUBSCRIPTION from 'chatty/src/graphql/group-added.subscription';
import { wsClient } from 'chatty/src/app';


import Header from './header';
import Group from './group';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }), // fake the user for now
  props: ({
    data: {
      loading, user, refetch, subscribeToMore,
    },
  }) => ({
    loading,
    user,
    refetch,
    subscribeToMessages() {
      return subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: {
          groupIds: R.pluck('id', user.groups),
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          const previousGroups = previousResult.user.groups;
          const newMessage = subscriptionData.data.messageAdded;

          const groupIndex = R.pluck('id', previousGroups).indexOf(newMessage.to.id);

          const edgesLens = R.lensPath(['user', 'groups', groupIndex, 'messages', 'edges']);

          return R.set(
            edgesLens,
            [
              {
                __typename: 'MessageEdge',
                node: newMessage,
                cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
              },
            ],
            previousResult,
          );
        },
      });
    },
    subscribeToGroups() {
      return subscribeToMore({
        document: GROUP_ADDED_SUBSCRIPTION,
        variables: { userId: user.id },
        updateQuery: (previousResult, { subscriptionData }) => {
          const newGroup = subscriptionData.data.groupAdded;
          const groupsLens = R.lensPath(['user', 'groups']);
          return R.over(groupsLens, R.append(newGroup), previousResult);
        },
      });
    },
  }),
});

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    if (!nextProps.user) {
      if (this.groupSubscription) {
        this.groupSubscription();
      }
      if (this.messagesSubscription) {
        this.messagesSubscription();
      }
      // clear the event subscription
      if (this.reconnected) {
        this.reconnected();
      }
    } else if (!this.reconnected) {
      const { refetch } = this.props;
      this.reconnected = wsClient.onReconnected(() => {
        refetch(); // check for any data lost during disconnect
      }, this);
    }
    if (
      nextProps.user
      && (!user || nextProps.user.groups.length !== user.groups.length)
    ) {
      // unsubscribe from old
      if (typeof this.messagesSubscription === 'function') {
        this.messagesSubscription();
      }
      // subscribe to new
      if (nextProps.user.groups.length) {
        this.messagesSubscription = nextProps.subscribeToMessages();
      }
    }
    if (!this.groupSubscription && nextProps.user) {
      this.groupSubscription = nextProps.subscribeToGroups();
    }
  }

  onRefresh = () => {
    const { refetch } = this.props;
    refetch();
  };

  keyExtractor = item => item.id.toString();

  goToMessages = group => () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('Messages', { groupId: group.id, title: group.name });
  };

  goToNewGroup = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('NewGroup');
  };

  renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages(item)} />;

  render() {
    const { user, networkStatus } = this.props;

    if (!user) {
      return null;
    }

    if (user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewGroup} />
          <Text style={styles.warning}>You do not have any groups.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => <Header onPress={this.goToNewGroup} />}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}

Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
  subscribeToMessages: PropTypes.func.isRequired,
  subscribeToGroups: PropTypes.func.isRequired,
};

const GropusWithLoading = withLoading(userQuery(Groups));

export default GropusWithLoading;
