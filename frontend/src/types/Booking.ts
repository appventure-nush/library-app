import { DateTime } from 'luxon';

export interface BookingListData {
  id: number;
  userId: number;
  type: String;
  startTime: DateTime;
  endTime: DateTime;
}

export interface BookingData extends BookingListData {
  reason: String;
}
