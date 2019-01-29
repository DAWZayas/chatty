import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import LOGIN_MUTATION from 'chatty/src/graphql/login.mutation';
import SIGNUP_MUTATION from 'chatty/src/graphql/signup.mutation';

import { Signin } from '../components';

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) => mutate({
      variables: { email, password },
    }),
  }),
});

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ username, email, password }) => mutate({
      variables: { username, email, password },
    }),
  }),
});
const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  login,
  signup,
  connect(mapStateToProps),
)(Signin);
