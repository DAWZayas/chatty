import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5f1ee',
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
    borderRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 32,
    padding: 8,
  },
  sendButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  sendButton: {
    height: 32,
    width: 32,
  },
  iconStyle: {
    marginRight: 0, // default is 12
  },
});
const sendButton = send => (
  <Icon.Button
    backgroundColor="blue"
    borderRadius={16}
    color="white"
    iconStyle={styles.iconStyle}
    name="send"
    onPress={send}
    size={16}
    style={styles.sendButton}
  />
);

const MessageInput = ({ send }) => (
  <Formik
    initialValues={{ messageText: '' }}
    onSubmit={({ messageText }, { resetForm }) => {
      send(messageText);
      resetForm({});
    }}
  >
    {({
      handleBlur, handleChange, handleSubmit, values,
    }) => (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleChange('messageText')}
            onBlur={handleBlur('messageText')}
            value={values.messageText}
            style={styles.input}
            placeholder="Type your message here!"
          />
        </View>
        <View style={styles.sendButtonContainer}>{sendButton(handleSubmit)}</View>
      </View>
    )}
  </Formik>
);
MessageInput.propTypes = {
  send: PropTypes.func.isRequired,
};
export default MessageInput;
