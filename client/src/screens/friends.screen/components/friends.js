import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Friend from './friend';
import friendRoutes from '../routes';
import actions from '../actions';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
    };
  }

  keyExtractor = item => item.id.toString();

  renderItem = routeActions => ({ item }) => (
    <Friend friend={item} actions={routeActions} />
  );

  addFriendInvitation = () => {
    const { navigation } = this.props;
    this.input.blur();
    navigation.navigate('InvitationsFromMe');
  };

  render() {
    const { users, navigation } = this.props;
    const { userId } = this.state;
    const {
      state: { routeName },
    } = navigation;

    const route = friendRoutes[routeName];
    const routeActions = R.map(
      actionName => R.find(({ action }) => action === actionName, actions),
      route.actions,
    );
    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          extraData={routeActions}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem(routeActions)}
          ListFooterComponent={() => (R.isEmpty(users) ? <Text>{route.emptyMessage}</Text> : null)
          }
        />
        {routeName === 'MyFriends' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 4,
            }}
          >
            <TextInput
              ref={(input) => {
                this.input = input;
              }}
              onChangeText={text => this.setState({ userId: +text })}
              keyboardType="numeric"
              style={{
                flex: 3,
                borderColor: 'gray',
                borderWidth: 1,
                margin: 5,
              }}
            />
            <Button
              onPress={this.addFriendInvitation}
              style={{ flex: 1, borderRdius: 12, margin: 5 }}
              title="Invite friend"
              disabled={!userId}
            />
          </View>
        )}
        <View>
          {R.compose(
            R.values,
            R.map(({ title, key, color }) => (
              <Button
                key={key}
                title={title}
                color={color}
                onPress={() => navigation.navigate(key)}
              />
            )),
            R.filter(({ key }) => key !== routeName),
          )(friendRoutes)}
        </View>
      </View>
    );
  }
}

Friends.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }),
  ),
};

export default Friends;
