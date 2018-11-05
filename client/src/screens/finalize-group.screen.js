import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { StackActions, NavigationActions } from 'react-navigation';

import { USER_QUERY } from '../graphql/user.query';
import CREATE_GROUP_MUTATION from '../graphql/create-group.mutation';
import SelectedUserList from '../components/selected-user-list.component';

const goToNewGroup = group => StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
    NavigationActions.navigate({
      routeName: 'Messages',
      params: { groupId: group.id, title: group.name },
    }),
  ],
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  detailsContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  input: {
    color: 'black',
    height: 35,
  },
  inputBorder: {
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  inputInstructions: {
    paddingTop: 6,
    color: '#777',
    fontSize: 12,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    color: 'blue',
    fontSize: 18,
    paddingTop: 2,
  },
  participants: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
});

class FinalizeGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: isReady ? (
        <View style={{ paddingRight: 10 }}>
          <Button title="Create" onPress={state.params.create} />
        </View>
      ) : (
        undefined
      ),
    };
  };

  constructor(props) {
    super(props);

    const { selected } = props.navigation.state.params;

    this.state = {
      selected,
    };

    this.create = this.create.bind(this);
    this.pop = this.pop.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    const { name, selected } = this.state;
    this.refreshNavigation(selected.length && name);
  }

  componentWillUpdate(nextProps, nextState) {
    const { name, selected } = this.state;
    if ((nextState.selected.length && nextState.name) !== (selected.length && name)) {
      this.refreshNavigation(nextState.selected.length && nextState.name);
    }
  }

  pop() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  remove(user) {
    const { selected } = this.state;
    const index = selected.indexOf(user);
    if (~index) {
      this.setState({
        selected: selected.filter((_, i) => i !== index),
      });
    }
  }

  create() {
    const { createGroup, navigation } = this.props;
    const { name, selected } = this.state;

    createGroup({
      name,
      userId: 1, // fake user for now
      userIds: R.map(R.prop('id'), selected),
    })
      .then((res) => {
        navigation.dispatch(goToNewGroup(res.data.createGroup));
      })
      .catch((error) => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  }

  refreshNavigation(ready) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: ready ? 'ready' : undefined,
      create: this.create,
    });
  }

  render() {
    const { navigation } = this.props;
    const { selected } = this.state;
    const { friendCount } = navigation.state.params;

    return (
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.imageContainer}>
            <Image style={styles.groupImage} source={{ uri: 'https://reactjs.org/logo-og.png' }} />
            <Text>edit</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <View style={styles.inputBorder}>
              <TextInput
                autoFocus
                onChangeText={name => this.setState({ name })}
                placeholder="Group Subject"
                style={styles.input}
              />
            </View>
            <Text style={styles.inputInstructions}>
              {'Please provide a group subject and optional group icon'}
            </Text>
          </View>
        </View>
        <Text style={styles.participants}>
          {`participants: ${selected.length} of ${friendCount}`.toUpperCase()}
        </Text>
        <View style={styles.selected}>
          {selected.length ? <SelectedUserList data={selected} remove={this.remove} /> : undefined}
        </View>
      </View>
    );
  }
}

FinalizeGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        friendCount: PropTypes.number.isRequired,
      }),
    }),
  }),
};

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    createGroup: group => mutate({
      variables: { group },
      update: (store, { data: { createGroup } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: USER_QUERY, variables: { id: group.userId } });

        // Add our message from the mutation to the end.
        data.user.groups.push(createGroup);

        // Write our data back to the cache.
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: group.userId },
          data,
        });
      },
    }),
  }),
});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default compose(
  userQuery,
  createGroupMutation,
)(FinalizeGroup);
