import React from 'react';
import {
  Button, Text, View, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    margin: 5,
  },
});

const Settings = ({ auth: { email, username } }) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Icon name="user" style={styles.item} />
      <Text style={styles.item}>{username}</Text>
    </View>
    <View style={styles.row}>
      <Icon name="envelope" style={styles.item} />
      <Text style={styles.item}>{email}</Text>
    </View>
    <View style={styles.row}>
      <Button title="Logout" onPress={() => {}} />
    </View>
  </View>
);

Settings.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default Settings;
