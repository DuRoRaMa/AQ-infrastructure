import gql from 'graphql-tag';

export const TABLO_STATUS = gql`
  {
    tabloTalons {
      id
      name
      logs {
        id
        action
        createdBy {
          username
          operatorSettings {
            location {
              name
            }
          }
        }
      }
    }
    lastTalonLog {
      id
    }
  }
`;
interface tabloTalonLog {
  id: number;
  action: string;
  createdBy: {
    operatorSettings?: {
      location: {
        name: string;
      };
    };
  };
}
export interface tabloTalons {
  id: number;
  name: string;
  logs: tabloTalonLog[];
}
export interface lastTalonLog {
  id: number;
}
