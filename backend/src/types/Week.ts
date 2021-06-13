export interface Slot {
  start: Date;
  end: Date;
}

export interface WeekViewData {
  disabledSlots: Slot[];
  occupiedSlots: Slot[];
}
