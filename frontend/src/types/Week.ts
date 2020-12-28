export interface Slot {
  startTime: string;
  endTime: string;
}

export interface WeekViewData {
  disabledSlots: Slot[];
  bookedSlots: Slot[];
}
