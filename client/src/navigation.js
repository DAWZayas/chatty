import R from 'ramda';
import React, { Component } from 'react';
import {
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createStackNavigator,
  NavigationActions,
  StackActions,
} from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import {
  BackHandler, Text, View, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

import Groups from './screens/groups.screen';
import Messages from './screens/messages.screen';
import NewGroup from './screens/new-group.screen';
import FinalizeGroup from './screens/finalize-group.screen';
import GroupDetails from './screens/group-details.screen';
import SigninScreen from './screens/signin.screen';

import { friendRoutes } from './screens/friends.screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});
const TestScreen = title => () => (
  <View style={styles.container}>
    <Text>{title}</Text>
  </View>
);

const FriendsSwitchNavigator = createSwitchNavigator(R.map(({ Screen }) => Screen, friendRoutes));

// tabs in main screen
const MainScreenNavigator = createMaterialTopTabNavigator(
  {
    Chats: { screen: Groups },
    Friends: {
      screen: FriendsSwitchNavigator,
      navigationOptions: (props) => {
        const {
          navigation: {
            state: { index, routes },
          },
        } = props;
        return { title: friendRoutes[routes[index].key].title };
      },
    },
    Settings: { screen: TestScreen('Settings') },
  },
  {
    initialRouteName: 'Chats',
  },
);

const StackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainScreenNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Messages: {
      screen: Messages,
    },
    GroupDetails: { screen: GroupDetails },
    NewGroup: { screen: NewGroup },
    FinalizeGroup: { screen: FinalizeGroup },
  },
  {
    mode: 'modal',
    headerMode: 'screen',
  },
);

const AppNavigator = createSwitchNavigator(
  {
    Auth: SigninScreen,
    App: StackNavigator,
  },
  {
    initialRouteName: 'Auth',
  },
);

// reducer initialization code
const initialState = AppNavigator.router.getStateForAction(
  StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Main',
      }),
    ],
  }),
);
export const navigationReducer = (state = null, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);
const App = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = state => ({
  state: state.nav,
});

class AppWithBackPress extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return <App {...this.props} />;
  }
}

const AppWithNavigationState = connect(mapStateToProps)(AppWithBackPress);
export default AppWithNavigationState;
