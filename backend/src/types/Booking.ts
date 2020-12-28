import { Optional } from './common';
import { RoomListData } from './Room';
import { UserListData } from './User';

export enum BookingType {
  BOOKING = 1,
  DISABLED = 2,
}

export interface BookingAttributes {
  id: number;
  type: BookingType;
  userId: number;
  roomId: number;
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreateData {
  roomId: number;
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingListViewData {
  id: number;
  user: UserListData;
  room: RoomListData;
  purpose: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingViewData extends BookingListViewData {
  details: string;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}
