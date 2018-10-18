import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import { graphql, compose } from 'react-apollo';

import Message from '../components/message.component';
import GROUP_QUERY from '../graphql/group.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
});

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state.params.title,
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
    this.renderItem = this.renderItem.bind(this);
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

  render() {
    const { group } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={group.messages.slice().reverse()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
        />
      </View>
    );
  }
}
Messages.propTypes = {
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
export default compose(
  groupQuery,
  withLoading,
)(Messages);
