import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import { formatRelative } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';

import Logo from 'chatty/src/components/logo';

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  groupText: {
    color: '#8c8c8c',
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  groupUsername: {
    paddingVertical: 4,
  },
});

const formatCreatedAt = createdAt => formatRelative(createdAt, new Date());

const Group = ({ goToMessages, group: { id, name, messages } }) => (
  <TouchableHighlight key={id} onPress={goToMessages}>
    <View style={styles.groupContainer}>
      <Logo style={styles.groupImage} />
      <View style={styles.groupTextContainer}>
        <View style={styles.groupTitleContainer}>
          <Text style={styles.groupName}>{`${name}`}</Text>
          <Text style={styles.groupLastUpdated}>
            {messages.edges.length ? formatCreatedAt(messages.edges[0].node.createdAt) : ''}
          </Text>
        </View>
        <Text style={styles.groupUsername}>
          {messages.edges.length ? `${messages.edges[0].node.from.username}:` : ''}
        </Text>
        <Text style={styles.groupText} numberOfLines={1}>
          {messages.edges.length ? messages.edges[0].node.text : ''}
        </Text>
      </View>
      <Icon name="angle-right" size={24} color="#8c8c8c" />
    </View>
  </TouchableHighlight>
);

Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    messages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          cursor: PropTypes.string,
          node: PropTypes.object,
        }),
      ),
    }),
  }),
};

export default Group;
