import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slot } from 'types/Week';
import { BookingFormValues } from '..';

import {
  selectCurrentRoom,
  selectOccupiedSlots,
  selectRooms,
} from '../selectors';
import { actions } from '../slice';
import Week from './TimeSlotPicker/Week';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { DateTime } from 'luxon';
import { Role } from 'types/User';
import { getCurrentUser } from 'app/containers/AuthenticatedPages/selectors';
import { useHistory } from 'react-router';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface SelectTimeSlotStepProps {
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectTimeSlotStep: React.FC<SelectTimeSlotStepProps> = props => {
  const { handleNext } = props;
  const selectedTimeSlot = useField<Slot | null>('selection');
  const { setFieldValue } = useFormikContext<BookingFormValues>();

  const history = useHistory();

  const [currentRoomIdx, setCurrentRoomIdx] = React.useState(0);
  const [deltaWeek, setDeltaWeek] = React.useState(0);
  const referenceDate = DateTime.local().startOf('weeks');

  const rooms = useSelector(selectRooms);
  const currentUser = useSelector(getCurrentUser);
  const currentRoom = useSelector(selectCurrentRoom);
  const occupiedSlots = useSelector(selectOccupiedSlots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadBookableRooms());
  }, [dispatch]);

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
  }, [currentRoom, deltaWeek, dispatch, setFieldValue]);

  const handleRoomChange = (newValue: number) => {
    setCurrentRoomIdx(newValue);
    dispatch(actions.updateCurrentRoom(newValue));
    selectedTimeSlot[2].setValue(null);
  };

  const currentWeekRange = () => {
    const startingDay = referenceDate.plus({ weeks: deltaWeek });
    const endingDay = startingDay.plus({ days: 4 });
    return `${startingDay.day} ${startingDay.monthShort} - ${endingDay.day} ${endingDay.monthShort}`;
  };

  const hasNextWeek = (role: Role): boolean => {
    switch (role) {
      case Role.STUDENT:
        return deltaWeek < 1;
      case Role.STAFF:
        return deltaWeek < 4;
      default:
        return true;
    }
  };

  if (currentUser === null) {
    history.push('/login');
    return <></>;
  }

  if (rooms.length === 0 || currentRoom === null) return <></>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"
          value={currentRoomIdx}
          onChange={e => handleRoomChange(Number(e.target.value))}
        >
          {rooms.map((room, roomIdx) => (
            <option key={room.id} value={roomIdx}>
              {room.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav
          className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
          aria-label="Rooms"
        >
          {rooms.map((room, roomIdx) => (
            <button
              type="button"
              key={room.id}
              onClick={() => handleRoomChange(roomIdx)}
              className={classNames(
                roomIdx === currentRoomIdx
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
                roomIdx === 0 ? 'rounded-l-lg' : '',
                roomIdx === rooms.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 focus:outline-none',
              )}
              aria-current={roomIdx === currentRoomIdx ? 'page' : undefined}
            >
              <span>{room.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  roomIdx === currentRoomIdx ? 'bg-teal-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-1',
                )}
              />
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 mt-2">
        <Week
          fieldName={'selection'}
          referenceDate={referenceDate.plus({ weeks: deltaWeek })}
          occupiedSlots={occupiedSlots}
          maximumDuration={currentUser.role === Role.STUDENT ? 120 : 750}
        />
      </div>
      <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px mt-2 justify-center">
        <button
          type="button"
          className="relative disabled:opacity-50 focus:outline-none inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => {
            setDeltaWeek(deltaWeek - 1);
            selectedTimeSlot[2].setValue(null);
          }}
          disabled={deltaWeek === 0}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          {currentWeekRange()}
        </span>
        <button
          type="button"
          className="relative disabled:opacity-50 focus:outline-none inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => {
            setDeltaWeek(deltaWeek + 1);
            selectedTimeSlot[2].setValue(null);
          }}
          disabled={!hasNextWeek(currentUser.role)}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          type="button"
          className="disabled:opacity-50 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNext}
          disabled={selectedTimeSlot[0].value === null}
        >
          Next
        </button>
        {selectedTimeSlot[0].value && (
          <div className="text-black dark:text-white text-center mr-1">
            <p>You have selected:</p>
            <p>
              {currentRoom.name},{' '}
              {selectedTimeSlot[0].value.start.hour.toString().padStart(2, '0')}
              :
              {selectedTimeSlot[0].value.start.minute
                .toString()
                .padStart(2, '0')}{' '}
              - {selectedTimeSlot[0].value.end.hour.toString().padStart(2, '0')}
              :
              {selectedTimeSlot[1].value?.end.minute
                .toString()
                .padStart(2, '0')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTimeSlotStep;
