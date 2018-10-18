import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

export const WithLoading = Component => ({ loading, ...props }) => {
  // render loading placeholder while we fetch
  if (loading) {
    return (
      <View style={[styles.loading, styles.container]}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Component {...props} />;
};

WithLoading.propTypes = {
  loading: PropTypes.bool,
};

export default WithLoading;
