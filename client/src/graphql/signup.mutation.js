import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $username: String) {
    signup(email: $email, password: $password, username: $username) {
      id
      jwt
      username
    }
  }
`;

export default SIGNUP_MUTATION;
