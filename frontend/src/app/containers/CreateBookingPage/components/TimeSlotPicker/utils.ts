import { DateTime } from 'luxon';
import { Slot } from 'types/Week';

type MinimumInterval = 15 | 30 | 60;

export function toDate(
  date: DateTime,
  pixelsFromTop: number,
  intervalInPixels: number,
  startOfDay: number = 8,
  minimumInterval: MinimumInterval = 30,
) {
  const minutesFromStartOfDay =
    (pixelsFromTop / intervalInPixels) * minimumInterval;
  return date
    .startOf('days')
    .plus({ hours: startOfDay, minutes: minutesFromStartOfDay });
}

export function toPosition(
  time: DateTime,
  intervalInPixels: number,
  startOfDay: number = 8,
  minimumInterval: MinimumInterval = 30,
) {
  return (
    (time.diff(time.startOf('days').plus({ hours: startOfDay }), 'minutes')
      .minutes /
      minimumInterval) *
    intervalInPixels
  );
}

export function toHeight(
  slot: Slot,
  intervalInPixels: number,
  minimumInterval: MinimumInterval = 30,
) {
  return (
    (slot.end.diff(slot.start, 'minutes').minutes / minimumInterval) *
    intervalInPixels
  );
}
