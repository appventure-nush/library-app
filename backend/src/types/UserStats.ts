import { Optional } from './common';

export interface UserStatsAttributes {
  id: number;
  userId: string;
  bookedPerWeek: number;
  infringement: number;
}

export interface UserStatsListData {
  bookedPerWeek: number;
}

export interface UserStatsCreationAttributes extends Optional<UserStatsAttributes, 'id'> {}
