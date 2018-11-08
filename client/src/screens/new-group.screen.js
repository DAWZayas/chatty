import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator, Button, Image, StyleSheet, Text, View,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import AlphabetListView from 'react-native-alpha-listview';
import Icon from 'react-native-vector-icons/FontAwesome';

import SelectedUserList from '../components/selected-user-list.component';
import Logo from '../components/logo';
import { USER_QUERY } from '../graphql/user.query';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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

const SectionHeader = ({ title }) => {
  // inline styles used for brevity, use a stylesheet when possible
  const textStyle = {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  };

  const viewStyle = {
    backgroundColor: '#ccc',
  };
  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{title}</Text>
    </View>
  );
};
SectionHeader.propTypes = {
  title: PropTypes.string,
};

const SectionItem = ({ title }) => <Text style={{ color: 'blue' }}>{title}</Text>;
SectionItem.propTypes = {
  title: PropTypes.string,
};

class Cell extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isSelected: props.isSelected(props.item),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isSelected: nextProps.isSelected(nextProps.item),
    });
  }

  toggle() {
    const { item, toggle } = this.props;
    toggle(item);
  }

  render() {
    const {
      item: { username },
    } = this.props;
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
            onPress={this.toggle}
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

class NewGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: isReady ? (
        <View style={{ paddingRight: 10 }}>
          <Button title="Next" onPress={state.params.finalizeGroup} />
        </View>
      ) : (
        undefined
      ),
    };
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    let selected = [];
    if (navigation.state.params) {
      selected = navigation.state.params.selected;
    }

    this.state = {
      selected: selected || [],
      friends: props.user
        ? R.groupBy(friend => friend.username.charAt(0).toUpperCase(), props.user.friends)
        : [],
    };

    this.finalizeGroup = this.finalizeGroup.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { selected } = this.state;
    this.refreshNavigation(selected);
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    const state = {};
    if (nextProps.user && nextProps.user.friends && nextProps.user !== user) {
      state.friends = R.groupBy(
        friend => friend.username.charAt(0).toUpperCase(),
        nextProps.user.friends,
      );
    }

    if (nextProps.selected) {
      Object.assign(state, {
        selected: nextProps.selected,
      });
    }

    this.setState(state);
  }

  componentWillUpdate(nextProps, nextState) {
    const { selected } = this.state;
    if (!!selected.length !== !!nextState.selected.length) {
      this.refreshNavigation(nextState.selected);
    }
  }

  refreshNavigation(selected) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: selected && selected.length ? 'ready' : undefined,
      finalizeGroup: this.finalizeGroup,
    });
  }

  finalizeGroup() {
    const {
      navigation: { navigate },
      user,
    } = this.props;
    const { selected } = this.state;
    navigate('FinalizeGroup', {
      selected,
      friendCount: user.friends.length,
      userId: user.id,
    });
  }

  isSelected(user) {
    const { selected } = this.state;
    return ~selected.indexOf(user);
  }

  toggle(user) {
    const { selected } = this.state;
    const index = selected.indexOf(user);

    this.setState({
      selected: ~index ? selected.filter((_, i) => i !== index) : [...selected, user],
    });
  }

  render() {
    const { user, loading } = this.props;
    const { selected, friends } = this.state;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {selected.length ? (
          <View style={styles.selected}>
            <SelectedUserList data={selected} remove={this.toggle} />
          </View>
        ) : (
          undefined
        )}
        {R.keys(friends).length ? (
          <AlphabetListView
            style={{ flex: 1 }}
            data={friends}
            cell={Cell}
            cellHeight={30}
            cellProps={{
              isSelected: this.isSelected,
              toggle: this.toggle,
            }}
            sectionListItem={SectionItem}
            sectionHeader={SectionHeader}
            sectionHeaderHeight={22.5}
          />
        ) : (
          undefined
        )}
      </View>
    );
  }
}

NewGroup.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    friends: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
      }),
    ),
  }),
  selected: PropTypes.arrayOf(PropTypes.object),
};

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }), // fake for now
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default compose(userQuery)(NewGroup);
