import gql from 'graphql-tag';

export const TALON_LOG_SUB = gql`
  subscription {
    talonLogs {
      id
      action
      talon {
        id
        name
      }
      createdBy {
        id
        operatorSettings {
          location {
            name
          }
        }
      }
    }
  }
`;

export interface talonLogs {
  id: number;
  action: string;
  talon: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    operatorSettings?: {
      location: {
        name: string;
      };
    };
  };
}
