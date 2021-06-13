import { DateTime } from 'luxon';

export interface Slot {
  start: DateTime;
  end: DateTime;
}

export interface RawSlot {
  start: string;
  end: string;
}

export interface DisabledSlot extends Slot {
  reason: string;
}

export interface RawDisabledSlot extends RawSlot {
  reason: string;
}

export interface OccupiedSlot extends Slot {}

export interface RawOccupiedSlot extends RawSlot {}

export interface WeekViewData {
  disabledSlots: DisabledSlot[];
  occupiedSlots: OccupiedSlot[];
}

export interface RawWeekViewData {
  disabledSlots: RawDisabledSlot[];
  occupiedSlots: RawOccupiedSlot[];
}
