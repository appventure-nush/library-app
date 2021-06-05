import { getTimeString } from 'app/components/TimeSlotPicker';
import { DateTime } from 'luxon';
import React, { Fragment, useRef } from 'react';

import {
  BookingListViewData,
  BookingStatus,
  BookingStatusString,
} from 'types/Booking';
import api from 'app/api';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DotsVerticalIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { actions } from '../slice';

interface DashboardCardProps {
  booking: BookingListViewData;
}

const DashboardCard: React.FC<DashboardCardProps> = props => {
  const { id, room, status } = props.booking;
  const now = DateTime.local();
  const startTime = DateTime.fromISO(props.booking.startTime);
  const endTime = DateTime.fromISO(props.booking.endTime);

  const history = useHistory();
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
  const [openCheckInDialog, setOpenCheckInDialog] = React.useState(false);
  const [openCheckOutDialog, setOpenCheckOutDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const roomPinRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    setIsSubmitting(true);
    console.log(roomPinRef.current?.value);
    api.booking.cancelBooking(id).then(() => {
      setOpenCancelDialog(false);
      dispatch(actions.dashboardRequest());
      dispatch(actions.loadOwnUserStats());
    });
  };

  const handleCheckIn = () => {
    if (!roomPinRef || !roomPinRef.current) {
      setHelperText('Wrong PIN');
      return;
    }
    setIsSubmitting(true);
    api.booking
      .checkInBooking(id, roomPinRef.current.value)
      .then(() => {
        setOpenCheckInDialog(false);
        history.go(0);
      })
      .catch(() => {
        setIsSubmitting(false);
        setHelperText('Wrong PIN');
      });
  };

  const handleCheckOut = () => {
    setIsSubmitting(true);
    api.booking
      .checkOutBooking(id)
      .then(() => {
        setOpenCheckOutDialog(false);
        history.go(0);
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error('Checkout failed');
      });
  };

  return (
    <li>
      <div className="block hover:bg-gray-50 dark:hover:bg-gray-700">
        <div className="px-4 py-4 flex items-center sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="text-gray-400 truncate">
              <p className="text-lg">
                {`${getTimeString(startTime)} - ${getTimeString(endTime)}`}
              </p>
              <p className="text-sm">
                {`${startTime.day} ${startTime.monthShort} (${startTime.weekdayShort})`}
              </p>
            </div>
          </div>

          <div className="truncate text-lg text-black dark:text-white w-20">
            {room.name}
          </div>
          <div className="ml-3 w-24 sm:w-32">
            <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm text-center font-medium bg-indigo-100 text-indigo-800">
              <svg
                className="-ml-0.5 sm:-ml-1 mr-1.5 h-2 w-2 text-indigo-400"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx={4} cy={4} r={3} />
              </svg>
              {BookingStatusString[status]}
            </span>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="ml-3 flex-shrink-0 inline-flex items-center focus:outline-none">
                <DotsVerticalIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-900 divide-y divide-gray-100 rounded-sm sm:rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {status === BookingStatus.CONFIRMED &&
                    now.diff(startTime, 'minutes').minutes < 0 && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-500 text-black'
                                : 'text-black dark:text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setOpenCancelDialog(true)}
                          >
                            <XCircleIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                            Cancel
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  {status === BookingStatus.CONFIRMED &&
                    now.diff(startTime, 'minutes').minutes >= 0 &&
                    now.diff(endTime, 'minutes').minutes < 0 && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-teal-700 text-white' : 'text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => {
                              setOpenCheckInDialog(true);
                              setHelperText('');
                            }}
                          >
                            <XCircleIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                            Check In
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  {status === BookingStatus.CHECKEDIN &&
                    now.diff(startTime, 'minutes').minutes >= 0 &&
                    now.diff(endTime, 'minutes').minutes < 0 && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-teal-700 text-white' : 'text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setOpenCheckOutDialog(true)}
                          >
                            <XCircleIcon
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                            Check Out
                          </button>
                        )}
                      </Menu.Item>
                    )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <Transition appear show={openCancelDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenCancelDialog(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-teal-50 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Are you sure you are cancelling the booking?
                </Dialog.Title>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setOpenCancelDialog(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={openCheckInDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenCheckInDialog(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-teal-50 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Please key in the current room PIN to check in
                </Dialog.Title>
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="room-pin" className="sr-only">
                    Room PIN
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <input
                      ref={roomPinRef}
                      type="text"
                      name="room-pin"
                      id="room-pin"
                      className="block w-full py-1 pl-1 pr-10 border-teal-300 text-teal-900 placeholder-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                      placeholder="123456"
                      defaultValue=""
                      maxLength={6}
                      aria-invalid={helperText !== ''}
                      aria-describedby="pin-error"
                    />
                  </div>
                  {helperText && (
                    <>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-600" id="pin-error">
                        {helperText}
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleCheckIn}
                    disabled={isSubmitting}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setOpenCheckInDialog(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={openCheckOutDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenCheckOutDialog(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-teal-50 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Are you sure you are checking out?
                </Dialog.Title>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleCheckOut}
                    disabled={isSubmitting}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setOpenCheckOutDialog(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </li>
    // <Card className={classes.root}>
    //   <CardContent>
    //     <Typography variant="h5" component="h2">
    //       {`${startTime.day} ${startTime.monthShort} (${
    //         startTime.weekdayShort
    //       }), ${getTimeString(startTime)} - ${getTimeString(endTime)}`}
    //     </Typography>
    //     <Typography color="textSecondary">
    //       {purpose} in {room.name}
    //     </Typography>
    //     {status === BookingStatus.CONFIRMED &&
    //       now.diff(startTime, 'minutes').minutes >= 0 &&
    //       now.diff(endTime, 'minutes').minutes < 0 && (
    //         <>
    //           <Button
    //             variant="outlined"
    //             color="primary"
    //             onClick={() => setOpenCheckInDialog(true)}
    //           >
    //             Check In
    //           </Button>
    //           <Dialog
    //             open={openCheckInDialog}
    //             onClose={() => setOpenCheckInDialog(false)}
    //             aria-labelledby="form-dialog-title"
    //           >
    //             <DialogTitle id="form-dialog-title">Check In</DialogTitle>
    //             <DialogContent>
    //               <DialogContentText>
    //                 Please key in the current room PIN to check in
    //               </DialogContentText>
    //               <TextField
    //                 error={!!helperText}
    //                 helperText={helperText}
    //                 autoFocus
    //                 margin="dense"
    //                 type="tel"
    //                 inputProps={{ maxLength: 6 }}
    //                 onChange={e => setPin(e.target.value)}
    //                 fullWidth
    //               />
    //             </DialogContent>
    //             <DialogActions>
    //               <Button
    //                 onClick={() => setOpenCheckInDialog(false)}
    //                 color="primary"
    //               >
    //                 Cancel
    //               </Button>
    //               <Button
    //                 onClick={handleCheckIn}
    //                 disabled={isSubmitting || pin.length < 6}
    //                 color="primary"
    //               >
    //                 Submit
    //               </Button>
    //             </DialogActions>
    //           </Dialog>
    //         </>
    //       )}
    //     {status === BookingStatus.CHECKEDIN &&
    //       now.diff(startTime, 'minutes').minutes >= 0 &&
    //       now.diff(endTime, 'minutes').minutes < 0 && (
    //         <>
    //           <Button
    //             variant="outlined"
    //             color="primary"
    //             onClick={() => setOpenCheckOutDialog(true)}
    //           >
    //             Check Out
    //           </Button>
    //           <Dialog
    //             open={openCheckOutDialog}
    //             onClose={() => setOpenCheckOutDialog(false)}
    //           >
    //             <DialogTitle id="alert-dialog-title">Check Out</DialogTitle>
    //             <DialogContent>
    //               <DialogContentText id="alert-dialog-description">
    //                 Confirm checking out room? Your remaining time will become
    //                 bookable by others
    //               </DialogContentText>
    //             </DialogContent>
    //             <DialogActions>
    //               <Button
    //                 onClick={() => setOpenCheckOutDialog(false)}
    //                 color="primary"
    //               >
    //                 Cancel
    //               </Button>
    //               <Button
    //                 onClick={handleCheckOut}
    //                 color="primary"
    //                 disabled={isSubmitting}
    //                 autoFocus
    //               >
    //                 Confirm
    //               </Button>
    //             </DialogActions>
    //           </Dialog>
    //         </>
    //       )}
    //   </CardContent>
    // </Card>
  );
};

export default DashboardCard;
