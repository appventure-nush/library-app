import { RoomListData } from './Room';
import { UserListData } from './User';

export interface BookingListData {
  id: number;
  userId: number;
  roomId: number;
  purpose: string;
  startTime: string;
  endTime: string;
}

export interface BookingListViewData {
  id: number;
  user: UserListData;
  room: RoomListData;
  purpose: string;
  startTime: string;
  endTime: string;
}

export interface BookingViewData extends BookingListViewData {
  details: string;
}

export interface BookingCreateData {
  roomId: number;
  purpose: String;
  details: String;
  startTime: Date;
  endTime: Date;
}
