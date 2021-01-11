import { PresetStatusColorType } from 'antd/lib/_util/colors';

import { RoomListData } from './Room';
import { UserListData } from './User';

export enum BookingStatus {
  CONFIRMED = 1,
  CANCELLED = 2,
  DELETED = 3,
  CHECKEDIN = 4,
  CHECKEDOUT = 5,
  AUTOCANCELLED = 6,
}

export const BookingStatusString: Record<BookingStatus, String> = {
  1: 'Confirmed',
  2: 'Cancelled',
  3: 'Deleted',
  4: 'Checked In',
  5: 'Checked Out',
  6: 'Auto Cancelled',
};

export const BookingStatusBadge: Record<
  BookingStatus,
  PresetStatusColorType
> = {
  1: 'success',
  2: 'warning',
  3: 'default',
  4: 'success',
  5: 'success',
  6: 'warning',
};

export interface BookingListData {
  id: number;
  status: BookingStatus;
  userId: string;
  roomId: number;
  purpose: string;
  startTime: string;
  endTime: string;
}

export interface BookingListViewData {
  id: number;
  status: BookingStatus;
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
