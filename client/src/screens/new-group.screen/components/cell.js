import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Logo from 'chatty/src/components/logo';

const styles = StyleSheet.create({
  cellContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cellImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cellLabel: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  checkButton: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    padding: 4,
    height: 24,
    width: 24,
  },
  checkButtonIcon: {
    marginRight: -4, // default is 12
  },
});

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.isSelected(props.item),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isSelected: nextProps.isSelected(nextProps.item),
    });
  }

  render() {
    const { item, toggle } = this.props;
    const { username } = item;
    const { isSelected } = this.state;
    return (
      <View style={styles.cellContainer}>
        <Logo style={styles.cellImage} />
        <Text style={styles.cellLabel}>{username}</Text>
        <View style={styles.checkButtonContainer}>
          <Icon.Button
            backgroundColor={isSelected ? 'blue' : 'white'}
            borderRadius={12}
            color="white"
            iconStyle={styles.checkButtonIcon}
            name="check"
            onPress={() => toggle(item)}
            size={16}
            style={styles.checkButton}
          />
        </View>
      </View>
    );
  }
}
Cell.propTypes = {
  isSelected: PropTypes.func,
  item: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Cell;
