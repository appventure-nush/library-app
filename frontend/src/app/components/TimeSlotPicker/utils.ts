import { DateTime, Settings } from 'luxon';
Settings.defaultZoneName = 'Asia/Singapore';

export const getDayString = (date: DateTime) =>
  `${date.day} ${date.monthShort} (${date.weekdayShort})`;

export const getDDMMM = (date: DateTime) => `${date.day} ${date.monthShort}`;

export const getStartingDay = (delta: number = 0) =>
  DateTime.local().startOf('week').startOf('day').plus({ days: delta });

export const HALF_AN_HOUR_IN_PIXELS = 50;
export const MINUTES_PER_IDX = 30;

export interface TimeSlotIdx {
  startIdx: number;
  endIdx: number;
}

export const getRoundedPosIdx = (start: number) =>
  Math.floor(start / HALF_AN_HOUR_IN_PIXELS);

export const getTimeString = (time: DateTime) =>
  time.toISOTime({ suppressSeconds: true, includeOffset: false });

export const getDurationFromIdx = (timeSlot: TimeSlotIdx) =>
  `${getTimeString(getTimeFromIdx(timeSlot.startIdx))} - ${getTimeString(
    getTimeFromIdx(timeSlot.endIdx + 1),
  )}`;

export const getTimeFromIdx = (posIdx: number, day: number = 0) =>
  getStartingDay(day)
    .set({ hour: 8, minute: 0, second: 0, millisecond: 0 })
    .plus({ minutes: posIdx * MINUTES_PER_IDX });

export const getIdxFromTime = (time: DateTime) =>
  ((time.hour - 8) * 60 + time.minute) / MINUTES_PER_IDX;

export const getTimeSlotIdxFromTime = (time: {
  start: DateTime;
  end: DateTime;
}): TimeSlotIdx => {
  return {
    startIdx: getIdxFromTime(time.start),
    endIdx: getIdxFromTime(time.end) - 1,
  };
};

export const getTimeFromTimeSlotIdx = (
  timeSlotIdx: TimeSlotIdx,
  day: number,
): { start: DateTime; end: DateTime } => {
  return {
    start: getTimeFromIdx(timeSlotIdx.startIdx, day),
    end: getTimeFromIdx(timeSlotIdx.endIdx + 1, day),
  };
};
