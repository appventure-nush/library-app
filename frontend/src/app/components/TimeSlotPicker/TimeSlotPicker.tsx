import { Paper } from '@material-ui/core';
import React from 'react';
import WeekCalendar from './WeekCalendar';
import WeekPicker from './WeekPicker';
import { Slot, Week } from './types';
import { DateTime } from 'luxon';

export interface TimeSlotPickerProps {
  fieldName: string;
  currentWeek: Week;
  disabledSlots: Slot[];
  bookedSlots: Slot[];
  hasNextWeek: Boolean;
  hasPreviousWeek: Boolean;
  onChangeNextWeek: () => void;
  onChangePrevWeek: () => void;
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
      />
    </Paper>
  );
};
