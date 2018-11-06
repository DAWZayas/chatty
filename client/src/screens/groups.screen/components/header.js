import React from 'react';
import PropTypes from 'prop-types';
import { Button, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
});

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title="New Group" onPress={onPress} />
  </View>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default Header;
