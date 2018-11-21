import gql from 'graphql-tag';

export const REMOVE_FROM_BLACK_LIST_MUTATION = gql`
  mutation removeFromBlackList($from: Int!, $to: Int!) {
    removeFromBlackList(from: $from, to: $to)
  }
`;

export default REMOVE_FROM_BLACK_LIST_MUTATION;
