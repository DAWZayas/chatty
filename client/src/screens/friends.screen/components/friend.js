import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import Action from './action';

const styles = StyleSheet.create({
  friendContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  friendName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});

const Friend = ({ friend: { id, username }, actions }) => (
  <View style={styles.friendContainer}>
    <Text style={styles.friendName}>{username}</Text>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
      {actions.map(action => Action({ ...action, userId: id }))}
    </View>
  </View>
);

Friend.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  actions: PropTypes.arrayOf(PropTypes.object),
};

export default Friend;
