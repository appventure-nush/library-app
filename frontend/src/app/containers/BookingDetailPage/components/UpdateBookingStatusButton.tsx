import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';
import api from 'app/api';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { BookingStatus, BookingStatusString } from 'types/Booking';
import { actions } from '../slice';

interface UpdateBookingStatusButtonProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

const UpdateBookingStatusButton: React.FC<UpdateBookingStatusButtonProps> = props => {
  const dispatch = useDispatch();
  const { bookingId, currentStatus } = props;

  const handleChange = (status: BookingStatus) => {
    api.booking
      .updateBookingStatus(bookingId, status)
      .then(() => dispatch(actions.loadBooking(bookingId)));
  };

  return (
    <Listbox value={currentStatus} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
          Update
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 w-36 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {Object.values(BookingStatus)
              .filter(key => !!!isNaN(Number(BookingStatus[key])))
              .map(key => {
                const statusNumber = Number(BookingStatus[key]);
                return (
                  <Listbox.Option
                    key={statusNumber}
                    className={({ active }) =>
                      `${active ? 'text-teal-900 bg-teal-100' : 'text-gray-900'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value={statusNumber}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? 'font-medium' : 'font-normal'
                          } block truncate`}
                        >
                          {BookingStatusString[statusNumber]}
                        </span>
                        {selected ? (
                          <span
                            className={`${
                              active ? 'text-teal-600' : 'text-teal-600'
                            }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default UpdateBookingStatusButton;
