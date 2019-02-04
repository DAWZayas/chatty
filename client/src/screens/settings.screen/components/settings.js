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

const Settings = ({ auth: { email, username, profile }, logout }) => {
  const color = profile && profile.color ? profile.color : 'blue';
  const itemStyle = {
    ...styles.item,
    color,
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name="user" style={itemStyle} />
        <Text style={itemStyle}>{username}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="envelope" style={itemStyle} />
        <Text style={itemStyle}>{email}</Text>
      </View>
      <View style={styles.row}>
        <Text style={{ ...itemStyle, alignSelf: 'center' }}>{color}</Text>
        <View
          style={{
            ...itemStyle,
            backgroundColor: color,
            height: 50,
            width: 50,
          }}
        />
      </View>
      <View style={styles.row}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
};

Settings.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
  logout: PropTypes.func.isRequired,
};

export default Settings;
