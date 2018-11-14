import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';

import { withLoading } from 'chatty/src/components/withLoading';

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

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
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
    const { user } = this.props;

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
        />
      </View>
    );
  }
}

Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
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
};

const GropusWithLoading = withLoading(Groups);

export default GropusWithLoading;
