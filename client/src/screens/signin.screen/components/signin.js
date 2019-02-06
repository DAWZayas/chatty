import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Color from 'color';

import { setCurrentUser } from 'chatty/src/actions/auth.actions';
import PasswordInput from './passwordInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
    paddingHorizontal: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginVertical: 6,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchAction: {
    paddingHorizontal: 4,
    color: 'blue',
  },
  submit: {
    marginVertical: 6,
  },
});

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

class Signin extends Component {
  static navigationOptions = {
    title: 'Chatty',
    headerLeft: null,
  };

  constructor(props) {
    super(props);

    if (props.auth && props.auth.jwt) {
      props.navigation.goBack();
    }

    this.state = {
      view: 'login',
      username: 'ustin.Leannon62',
      email: 'Graham_Medhurst18@hotmail.com',
      password: 'Graham_Medhurst18@hotmail.com',
      passwordRepeated: 'Graham_Medhurst18@hotmail.com',
      color: 'blue',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.jwt) {
      nextProps.navigation.goBack();
    }
  }

  changeState = key => (value) => {
    this.setState({
      [key]: value,
    });
  };

  login = () => {
    const { email, password, view } = this.state;
    const { login, dispatch } = this.props;

    this.setState({
      loading: true,
    });

    login({ email, password })
      .then(({ data: { login: user } }) => {
        this.setState(
          {
            loading: false,
          },
          () => {
            dispatch(setCurrentUser(user));
            dispatch(
              NavigationActions.navigate({
                routeName: 'App',
              }),
            );
          },
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        Alert.alert(`${capitalizeFirstLetter(view)} error`, error.message, [
          { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
          {
            text: 'Forgot password',
            onPress: () => console.log('Forgot Pressed'),
            style: 'cancel',
          }, // eslint-disable-line no-console
        ]);
      });
  };

  signup = () => {
    const { view } = this.state;
    const { signup, dispatch } = this.props;
    this.setState({
      loading: true,
    });
    const {
      email, password, username, color,
    } = this.state;
    signup({
      email,
      password,
      username,
      color,
    })
      .then(({ data: { signup: user } }) => {
        dispatch(setCurrentUser(user));
        this.setState({
          loading: false,
        });
        this.setState({
          view: 'login',
          loading: false,
          username: user.username,
          email: user.email,
          password: '',
          passwordRepeated: '',
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          `${capitalizeFirstLetter(view)} error`,
          error.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }], // eslint-disable-line no-console
        );
      });
  };

  switchView = () => {
    const { view } = this.state;
    this.setState({
      view: view === 'signup' ? 'login' : 'signup',
    });
  };

  checkDisabled = () => {
    const {
      view, loading, email, password, passwordRepeated, username, color,
    } = this.state;

    let validColor = true;
    try {
      color && new Color(color);
    } catch {
      validColor = false;
    }

    const jwt = R.path(['auth', 'jwt'], this.props);

    if (R.isEmpty(R.trim(email)) || R.isEmpty(R.trim(password))) {
      return true;
    }

    if (
      view === 'signup'
      && (R.isEmpty(R.trim(username)) || password !== passwordRepeated || !validColor)
    ) {
      return true;
    }

    return loading || !!jwt;
  };

  render() {
    const {
      view, loading, username, email, password, passwordRepeated, color,
    } = this.state;

    let backgroundColor = null;
    let foregroundColor = null;
    try {
      backgroundColor = new Color(color);
      foregroundColor = backgroundColor.negate();
    } catch {
      backgroundColor = 'rgba(0, 0, 0, 0.2)';
      foregroundColor = 'black';
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          undefined
        )}
        <View style={styles.inputContainer}>
          {view === 'signup' && (
            <TextInput
              defaultValue={username}
              onChangeText={this.changeState('username')}
              placeholder="Username"
              style={styles.input}
            />
          )}
          <TextInput
            defaultValue={email}
            onChangeText={this.changeState('email')}
            placeholder="Email"
            style={styles.input}
          />
          <PasswordInput defaultValue={password} setPassword={this.changeState('password')} />
          {view === 'signup' && (
            <View>
              <PasswordInput
                placeholder="repeat password"
                defaultValue={passwordRepeated}
                setPassword={this.changeState('passwordRepeated')}
              />
              <TextInput
                defaultValue={color}
                onChangeText={this.changeState('color')}
                placeholder="Color"
                style={[styles.input, { backgroundColor, color: foregroundColor }]}
              />
            </View>
          )}
        </View>
        <Button
          onPress={this[view]}
          style={styles.submit}
          title={view === 'signup' ? 'Sign up' : 'Login'}
          disabled={this.checkDisabled()}
        />
        <View style={styles.switchContainer}>
          <Text>{view === 'signup' ? 'Already have an account?' : 'New to Chatty?'}</Text>
          <TouchableOpacity onPress={this.switchView}>
            <Text style={styles.switchAction}>{view === 'login' ? 'Sign up' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
Signin.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    jwt: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default Signin;
