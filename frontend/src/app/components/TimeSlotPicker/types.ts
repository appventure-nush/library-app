import { DateTime } from 'luxon';

export interface SlotIdx {
  startIdx: number;
  endIdx: number;
  color: string;
}

export interface Slot {
  startTime: DateTime;
  endTime: DateTime;
  color: string;
}

export interface Week {
  title: string;
  weekYear: number;
  weekNumber: number;
}
