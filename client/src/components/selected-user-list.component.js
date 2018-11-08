import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Logo from './logo';

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: '#dbdbdb',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    top: -3,
    width: 20,
  },
});

export class SelectedUserListItem extends Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
  }

  remove() {
    const { remove, user } = this.props;
    remove(user);
  }

  render() {
    const {
      user: { username },
    } = this.props;

    return (
      <View style={styles.itemContainer}>
        <View>
          <Logo />
          <TouchableOpacity onPress={this.remove} style={styles.itemIcon}>
            <Icon color="white" name="times" size={12} />
          </TouchableOpacity>
        </View>
        <Text>{username}</Text>
      </View>
    );
  }
}
SelectedUserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  remove: PropTypes.func,
};

class SelectedUserList extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  keyExtractor = item => item.id.toString();

  renderItem({ item: user }) {
    const { remove } = this.props;
    return <SelectedUserListItem user={user} remove={remove} />;
  }

  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        horizontal
        style={styles.list}
      />
    );
  }
}
SelectedUserList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func,
};

export default SelectedUserList;
