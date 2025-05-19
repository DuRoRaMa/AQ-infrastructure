import gql from 'graphql-tag';

export const IN_QUEUE_TALONS = gql`
  {
    inQueueTalons {
      id
      name
      createdAt
    }
  }
`;
export interface in_queue_talon {
  id: number;
  name: string;
  createdAt: string;
}
