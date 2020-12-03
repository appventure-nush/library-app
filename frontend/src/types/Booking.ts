export interface BookingListData {
  id: number;
  userId: number;
  purpose: string;
  startTime: string;
  endTime: string;
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
