import { DateTime } from 'luxon';

export interface Slot {
  start: DateTime;
  end: DateTime;
}

export interface DisabledSlot extends Slot {
  reason: string;
}

export interface OccupiedSlot extends Slot {}
