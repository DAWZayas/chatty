import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginVertical: 6,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 6,
  },
});

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  render() {
    const { visible } = this.state;
    const { setPassword, defaultValue, placeholder = 'Password' } = this.props;
    return (
      <View style={styles.container}>
        <TextInput
          defaultValue={defaultValue}
          onChangeText={setPassword}
          placeholder={placeholder}
          secureTextEntry={!visible}
          style={styles.input}
        />
        <Icon
          name={visible ? 'eye-slash' : 'eye'}
          style={styles.icon}
          onPress={() => this.setState({
            visible: !visible,
          })
          }
        />
      </View>
    );
  }
}

PasswordInput.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  setPassword: PropTypes.func.isRequired,
};

export default PasswordInput;
