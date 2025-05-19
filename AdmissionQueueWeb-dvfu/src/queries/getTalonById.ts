import gql from 'graphql-tag';

const GET_TALON_BY_ID = gql`
  query getTalonById($id: ID!) {
    talon(pk: $id) {
      id
      name
      ordinal
      action
      createdAt
      purpose {
        name
        description
      }
      logs {
        id
        action
        comment
        createdAt
      }
    }
    countActiveTalons
  }
`;
export default GET_TALON_BY_ID;
