import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $username: String, $color: String) {
    signup(email: $email, password: $password, username: $username, color: $color) {
      id
      username
      email
    }
  }
`;

export default SIGNUP_MUTATION;
