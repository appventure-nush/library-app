import { Paper } from '@material-ui/core';
import React, { useState } from 'react';
import WeekCalendar from './WeekCalendar';
import { getStartingDay } from './utils';
import WeekPicker from './WeekPicker';

export interface TimeSlotPickerProps {
  currentWeekTitle: String;
  multipleSelection?: Boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = props => {
  const { currentWeekTitle } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasNeighbourWeeks, setHasNeighbourWeeks] = useState({
    next: true,
    prev: false,
  });

  return (
    <Paper>
      <WeekPicker
        currentWeekTitle={currentWeekTitle}
        startDate={getStartingDay()}
        onChangeNextWeek={() => {}}
        onChangePrevWeek={() => {}}
        hasNext={hasNeighbourWeeks.next}
        hasPrev={hasNeighbourWeeks.prev}
      />
      <WeekCalendar />
    </Paper>
  );
};
