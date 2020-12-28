export interface Slot {
  startTime: Date;
  endTime: Date;
}

export interface WeekViewData {
  disabledSlots: Slot[];
  bookedSlots: Slot[];
}
