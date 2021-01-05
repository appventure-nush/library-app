import { DateTime } from 'luxon';
import React from 'react';

import { Paper } from '@material-ui/core';

import { Slot, Week } from './types';
import WeekCalendar from './WeekCalendar';
import WeekPicker from './WeekPicker';

export interface TimeSlotPickerProps {
  fieldName: string;
  currentWeek: Week;
  disabledSlots: Slot[];
  bookedSlots: Slot[];
  hasNextWeek: Boolean;
  hasPreviousWeek: Boolean;
  onChangeNextWeek: () => void;
  onChangePrevWeek: () => void;
  maxSlotNumber?: number;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = props => {
  const {
    fieldName,
    currentWeek,
    disabledSlots,
    bookedSlots,
    hasPreviousWeek,
    hasNextWeek,
    onChangeNextWeek,
    onChangePrevWeek,
    maxSlotNumber,
  } = props;
  const { title, weekYear, weekNumber } = currentWeek;
  const referenceDate = DateTime.fromObject({
    weekYear: weekYear,
    weekNumber: weekNumber,
    weekday: 1,
  });

  return (
    <Paper>
      <WeekPicker
        currentWeekTitle={title}
        referenceDate={referenceDate}
        onChangeNextWeek={onChangeNextWeek}
        onChangePrevWeek={onChangePrevWeek}
        hasNext={hasNextWeek}
        hasPrev={hasPreviousWeek}
      />
      <WeekCalendar
        fieldName={fieldName}
        referenceDate={referenceDate}
        disabledSlots={disabledSlots}
        bookedSlots={bookedSlots}
        maxSlotNumber={maxSlotNumber}
      />
    </Paper>
  );
};
