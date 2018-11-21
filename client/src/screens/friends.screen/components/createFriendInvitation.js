import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, TextInput, View,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class CreateFriendInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toUserId: null,
    };
  }

  createFriendInvitation = () => {
    const { navigation, createFriendInvitation } = this.props;
    const { toUserId } = this.state;

    createFriendInvitation({
      from: 1,
      to: toUserId,
      text: "I'm Brook.Hudson and I'd to be your friend.",
    })
      .then(() => {
        this.input.blur();
        this.setState({ toUserId: null });
        navigation.navigate('InvitationsFromMe');
      })
      .catch(() => Alert.alert('Error when creating friend invitation'));
  };

  render() {
    const { toUserId } = this.state;

    return (
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
          onChangeText={text => this.setState({ toUserId: +text })}
          keyboardType="numeric"
          style={{
            flex: 3,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 5,
          }}
        />
        <Button
          onPress={this.createFriendInvitation}
          style={{
            flex: 1,
            borderRdius: 12,
            marginVertical: 5,
          }}
          title="Invite friend"
          disabled={!toUserId}
        />
      </View>
    );
  }
}

CreateFriendInvitation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  createFriendInvitation: PropTypes.func.isRequired,
};

export default withNavigation(CreateFriendInvitation);
