import { TimeSlotPicker } from 'app/components/TimeSlotPicker';
import { getCurrentUser } from 'app/containers/AuthenticatedPages/selectors';
import { Slot } from 'app/components/TimeSlotPicker/types';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Role } from 'types/User';
import {
  selectBookedSlots,
  selectCurrentRoom,
  selectDisabledSlots,
} from '../selectors';
import { actions } from '../slice';
import { useFormikContext } from 'formik';

export interface TimeSlotTabProps {}

const TimeSlotTab: React.FC<TimeSlotTabProps> = props => {
  const currentUser = useSelector(getCurrentUser);
  const bookedSlots = useSelector(selectBookedSlots);
  const disabledSlots = useSelector(selectDisabledSlots);
  const currentRoom = useSelector(selectCurrentRoom);

  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (currentRoom !== null) {
      dispatch(actions.loadCurrentWeekSlots(currentRoom.id));
      setFieldValue('roomId', currentRoom.id);
    }
  }, [dispatch, setFieldValue, currentRoom]);

  const currentWeek = DateTime.local().startOf('weeks').startOf('days');
  return (
    <TimeSlotPicker
      fieldName="timeSlot"
      maxSlotNumber={
        currentUser && currentUser.role === Role.STUDENT ? 4 : undefined
      }
      currentWeek={{
        title: '',
        weekYear: currentWeek.weekYear,
        weekNumber: currentWeek.weekNumber,
      }}
      disabledSlots={disabledSlots.map(slot => {
        const pickerSlot: Slot = {
          startTime: DateTime.fromISO(slot.startTime),
          endTime: DateTime.fromISO(slot.endTime),
          color: 'volcano',
        };
        return pickerSlot;
      })}
      bookedSlots={bookedSlots.map(slot => {
        const pickerSlot: Slot = {
          startTime: DateTime.fromISO(slot.startTime),
          endTime: DateTime.fromISO(slot.endTime),
          color: 'volcano',
        };
        return pickerSlot;
      })}
      hasNextWeek={false}
      hasPreviousWeek={false}
      onChangeNextWeek={() => {}}
      onChangePrevWeek={() => {}}
    />
  );
};

export default TimeSlotTab;
