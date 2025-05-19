import gql from 'graphql-tag';

export const TALONS = gql`
  query ($pagination: OffsetPaginationInput, $order: HistoryTalonOrder) {
    historyTalons(pagination: $pagination, order: $order) {
      id
      name
      createdAt
      logs {
        action
        createdAt
        createdBy {
          username
        }
      }
    }
    countHistoryTalons
  }
`;
interface tabloTalonLog {
  id: number;
  action: string;
  createdAt: string;
  createdBy: {
    username: string;
  };
}
export interface HistoryTalon {
  id: number;
  name: string;
  createdAt: string;
  logs: tabloTalonLog[];
}
