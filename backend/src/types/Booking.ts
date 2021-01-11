import { Optional } from './common';
import { RoomListData } from './Room';
import { UserListData } from './User';

export enum BookingType {
  BOOKING = 1,
  DISABLED = 2,
}

export enum BookingStatus {
  CONFIRMED = 1,
  CANCELLED = 2,
  DELETED = 3,
  CHECKEDIN = 4,
  CHECKEDOUT = 5,
  AUTOCANCELLED = 6,
}

export interface BookingAttributes {
  id: number;
  type: BookingType;
  status: BookingStatus;
  userId: string;
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
  startTime: string;
  endTime: string;
}

export interface BookingListViewData {
  id: number;
  status: BookingStatus;
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
