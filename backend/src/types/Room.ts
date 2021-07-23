import { Optional } from './common';
import { Role } from './User';

export interface RoomAttributes {
  id: number;
  name: string;
  capacity: number;
  staffOnly: boolean;
  checkInPin: string | null;
}

export interface RoomListData {
  id: number;
  name: string;
  capacity: number;
}

export interface RoomCreateData {
  name: string;
  capacity: number;
  staffOnly: boolean;
}

export interface RoomPinData {
  name: string;
  checkInPin: string;
}

export interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}
