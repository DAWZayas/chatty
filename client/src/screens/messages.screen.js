import PropTypes from 'prop-types';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import { graphql, compose } from 'react-apollo';

import Message from '../components/message.component';
import MessageInput from '../components/message-input.component';
import { withLoading } from '../components/withLoading';
import Logo from '../components/logo';

import GROUP_QUERY from '../graphql/group.query';
import CREATE_MESSAGE_MUTATION from '../graphql/create-message.mutation';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
  titleWrapper: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;

    const goToGroupDetails = () => navigate('GroupDetails', {
      id: state.params.groupId,
      title: state.params.title,
    });

    return {
      headerTitle: (
        <TouchableOpacity style={styles.titleWrapper} onPress={goToGroupDetails}>
          <View style={styles.title}>
            <Logo style={styles.titleImage} />
            <Text>{state.params.title}</Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const usernameColors = {};
    if (props.group && props.group.users) {
      props.group.users.forEach((user) => {
        usernameColors[user.username] = randomColor();
      });
    }
    this.state = {
      usernameColors,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { usernameColors } = this.state;
    const newUsernameColors = {};
    // check for new messages
    if (nextProps.group) {
      if (nextProps.group.users) {
        // apply a color to each user
        nextProps.group.users.forEach((user) => {
          newUsernameColors[user.username] = usernameColors[user.username] || randomColor();
        });
      }
      this.setState({
        usernameColors: newUsernameColors,
      });
    }
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: message }) => {
    const { usernameColors } = this.state;
    return (
      <Message
        color={usernameColors[message.from.username]}
        isCurrentUser={message.from.id === 1} // for now until we implement auth
        message={message}
      />
    );
  };

  send = (text) => {
    const { createMessage, navigation } = this.props;
    createMessage({
      groupId: navigation.state.params.groupId,
      userId: 1, // faking the user for now
      text,
    }).then(() => {
      this.flatList.scrollToEnd({ animated: true });
    });
  };

  render() {
    const { group } = this.props;

    if (!group) {
      return null;
    }

    return (
      <View style={styles.container}>
        <FlatList
          ref={(ref) => {
            this.flatList = ref;
          }}
          data={group.messages.slice().reverse()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
        />
        <MessageInput send={this.send} />
      </View>
    );
  }
}

Messages.propTypes = {
  createMessage: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        groupId: PropTypes.number,
      }),
    }),
  }),
  group: PropTypes.shape({
    messages: PropTypes.array,
    users: PropTypes.array,
  }),
};

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
