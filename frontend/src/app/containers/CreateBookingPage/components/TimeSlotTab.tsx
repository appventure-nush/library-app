import { TimeSlotPicker } from 'app/components/TimeSlotPicker';
import { getCurrentUser } from 'app/containers/AuthenticatedPages/selectors';
import { Slot } from 'app/components/TimeSlotPicker/types';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Role } from 'types/User';
import {
  selectBookedSlots,
  selectCurrentRoom,
  selectDisabledSlots,
} from '../selectors';
import { actions } from '../slice';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';

export interface TimeSlotTabProps {}

const TimeSlotTab: React.FC<TimeSlotTabProps> = props => {
  const [deltaWeek, setDeltaWeek] = useState(0);
  const currentUser = useSelector(getCurrentUser);
  const bookedSlots = useSelector(selectBookedSlots);
  const disabledSlots = useSelector(selectDisabledSlots);
  const currentRoom = useSelector(selectCurrentRoom);
  const history = useHistory();

  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (currentRoom !== null) {
      dispatch(
        actions.loadCurrentWeekSlots({
          roomId: currentRoom.id,
          delta: deltaWeek,
        }),
      );
      setFieldValue('roomId', currentRoom.id);
    }
  }, [dispatch, setFieldValue, currentRoom, deltaWeek]);

  if (currentUser === null) {
    history.push('/login');
    return <></>;
  }

  const currentWeek = DateTime.local().startOf('weeks').startOf('days');
  return (
    <TimeSlotPicker
      fieldName="timeSlot"
      maxSlotNumber={currentUser.role === Role.STUDENT ? 4 : undefined}
      currentWeek={{
        title: '',
        weekYear: currentWeek.plus({ weeks: deltaWeek }).weekYear,
        weekNumber: currentWeek.plus({ weeks: deltaWeek }).weekNumber,
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
      hasNextWeek={
        currentUser.role === Role.STUDENT && deltaWeek > 1 ? false : true
      }
      hasPreviousWeek={deltaWeek > 0}
      onChangeNextWeek={() => {
        setDeltaWeek(deltaWeek + 1);
        dispatch(
          actions.saveCurrentWeekSlots({ bookedSlots: [], disabledSlots: [] }),
        );
      }}
      onChangePrevWeek={() => {
        setDeltaWeek(deltaWeek - 1);
        dispatch(
          actions.saveCurrentWeekSlots({ bookedSlots: [], disabledSlots: [] }),
        );
      }}
    />
  );
};

export default TimeSlotTab;
