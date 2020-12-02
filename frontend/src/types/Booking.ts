export interface BookingListData {
  id: number;
  userId: number;
  purpose: String;
  startTime: Date;
  endTime: Date;
}

export interface BookingData extends BookingListData {
  details: String;
}

export interface BookingCreateData {
  purpose: String;
  details: String;
  startTime: Date;
  endTime: Date;
}
