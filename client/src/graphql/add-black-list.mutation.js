import gql from 'graphql-tag';

export const ADD_TO_BLACK_LIST_MUTATION = gql`
  mutation addToBlackList($from: Int!, $to: Int!) {
    addToBlackList(from: $from, to: $to) {
      id
      from {
        username
      }
      to {
        username
      }
    }
  }
`;

export default ADD_TO_BLACK_LIST_MUTATION;
