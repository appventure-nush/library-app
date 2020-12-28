import { DateTime } from 'luxon';
import { Slot, SlotIdx } from './types';

export const getDayString = (date: DateTime) =>
  `${date.day} ${date.monthShort} (${date.weekdayShort})`;

export const getDDMMM = (date: DateTime) => `${date.day} ${date.monthShort}`;

export const HALF_AN_HOUR_IN_PIXELS = 50;
export const MINUTES_PER_IDX = 30;

export const getRoundedPosIdx = (start: number) =>
  Math.floor(start / HALF_AN_HOUR_IN_PIXELS);

export const getTimeString = (time: DateTime) =>
  time.toISOTime({ suppressSeconds: true, includeOffset: false });

export const getDurationFromIdx = (slotIdx: SlotIdx) =>
  `${getTimeString(mapToTime(slotIdx.startIdx))} - ${getTimeString(
    mapToTime(slotIdx.endIdx + 1),
  )}`;

// MARK: - Index to Time Mappers

export const mapToTime = (
  posIdx: number,
  referenceDate: DateTime = DateTime.local(),
) =>
  referenceDate
    .startOf('day')
    .set({ hour: 8, minute: 0, second: 0, millisecond: 0 })
    .plus({ minutes: posIdx * MINUTES_PER_IDX });

export const mapToSlot = (slotIdx: SlotIdx, referenceDate: DateTime): Slot => {
  return {
    startTime: mapToTime(slotIdx.startIdx, referenceDate),
    endTime: mapToTime(slotIdx.endIdx + 1, referenceDate),
    color: slotIdx.color,
  };
};

// MARK: - Time to Index Mappers

export const mapToIndex = (time: DateTime) =>
  ((time.hour - 8) * 60 + time.minute) / MINUTES_PER_IDX;

export const mapToSlotIdx = (slot: Slot): SlotIdx => {
  return {
    startIdx: mapToIndex(slot.startTime),
    endIdx: mapToIndex(slot.endTime) - 1,
    color: slot.color,
  };
};
