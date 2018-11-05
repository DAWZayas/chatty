import gql from 'graphql-tag';

const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      id
      name
      users {
        id
      }
    }
  }
`;

export default CREATE_GROUP_MUTATION;
