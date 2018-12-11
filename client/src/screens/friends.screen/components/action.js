import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  actionButton: {
    padding: 4,
    height: 32,
    width: 32,
  },
  actionButtonIcon: {
    paddingLeft: 2,
    marginRight: -12, // default is 12
  },
});

const Action = ({
  action, name, color, style, userId, actionHOC,
}) => {
  const WithMakeAction = actionHOC(({ makeAction }) => (
    <View style={{ marginLeft: 4 }}>
      <Icon.Button
        name={name}
        color={color}
        borderRadius={16}
        iconStyle={styles.actionButtonIcon}
        size={24}
        style={[styles.actionButton, style]}
        onPress={() => makeAction(userId)}
      />
    </View>
  ));

  return <WithMakeAction key={action} />;
};

Action.propTypes = {
  action: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  style: PropTypes.shape({}),
};

export default Action;
