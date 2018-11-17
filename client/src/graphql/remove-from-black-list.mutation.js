import gql from 'graphql-tag';

const REOMOVE_FROM_BLACK_LIST_MUTATION = gql`
  mutation removeFromBlackList($from: Int!, $to: Int!) {
    removeFromBlackList(from: $from, to: $to)
  }
`;

export default REOMOVE_FROM_BLACK_LIST_MUTATION;
