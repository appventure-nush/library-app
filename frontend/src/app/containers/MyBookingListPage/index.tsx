/**
 *
 * BookingListPage
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { selectMyBookingList } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { myBookingListPageSaga } from './saga';
import BookingCard from './components/BookingCard';

interface Props {}

const LIMIT = 5;

export function MyBookingListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: myBookingListPageSaga });

  const bookingList = useSelector(selectMyBookingList);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(bookingList.length / LIMIT);

  useEffect(() => {
    dispatch(actions.loadBookings());
  }, [dispatch]);

  const slicedBookingList = useMemo(
    () =>
      bookingList.slice(
        (currentPage - 1) * LIMIT,
        (currentPage - 1) * LIMIT + LIMIT,
      ),
    [bookingList, currentPage],
  );

  const onNextPageChanged = useCallback(() => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  }, [currentPage, maxPage]);

  const onPrevPageChanged = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  return (
    <>
      <Helmet>
        <title>Bookings</title>
        <meta name="description" content="Description of BookingListPage" />
      </Helmet>
      <div className="flex flex-col items-center w-full py-8 px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow dark:bg-black overflow-visible rounded-sm sm:rounded-md w-full md:max-w-7xl">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {slicedBookingList.length === 0 && (
              <li>
                <div className="block">
                  <p className="text-lg text-gray-400 px-4 py-4 flex items-center sm:px-6">
                    You don't have any upcoming bookings!
                  </p>
                </div>
              </li>
            )}

            {slicedBookingList.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </ul>
        </div>
        <nav
          className="px-4 py-3 flex items-center w-full md:max-w-7xl justify-between sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * LIMIT + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(
                  (currentPage - 1) * LIMIT + LIMIT,
                  bookingList.length,
                )}
              </span>{' '}
              of <span className="font-medium">{bookingList.length}</span>{' '}
              results
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={onPrevPageChanged}
              disabled={currentPage <= 1}
              className="disabled:opacity-50 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-sm md:rounded-md text-white bg-teal-500 focus:outline-none"
            >
              Previous
            </button>
            <button
              onClick={onNextPageChanged}
              disabled={currentPage >= maxPage}
              className="disabled:opacity-50 ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-sm md:rounded-md text-white bg-teal-500 focus:outline-none"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
