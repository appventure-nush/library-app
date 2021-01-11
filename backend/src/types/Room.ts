import { Optional } from './common';

export interface RoomAttributes {
  id: number;
  name: string;
  checkInPin: string | null;
}

export interface RoomListData {
  id: number;
  name: string;
}

export interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}
