import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $username: String) {
    signup(email: $email, password: $password, username: $username) {
      id
      username
      email
    }
  }
`;

export default SIGNUP_MUTATION;
