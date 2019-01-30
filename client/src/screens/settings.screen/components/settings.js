import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
const Settings = ({ title }) => () => (
  <View style={styles.container}>
    <Text>{title}</Text>
  </View>
);

export default Settings;
