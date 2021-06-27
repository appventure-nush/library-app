/**
 *
 * BookingDetailPage
 *
 */

import { Badge } from 'antd';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BookingStatusBadge, BookingStatusString } from 'types/Booking';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { selectBookingDetailPage } from '../BookingDetailPage/selectors';
import { actions, reducer, sliceKey } from '../BookingDetailPage/slice';
import { myBookingDetailPageSaga } from './saga';

interface Props {}

export function MyBookingDetailPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: myBookingDetailPageSaga });

  const { booking } = useSelector(selectBookingDetailPage);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(actions.loadBooking(id));
  }, [dispatch, id]);

  if (booking === null) return <></>;

  return (
    <>
      <Helmet>
        <title>My Booking Info</title>
        <meta name="description" content="Description of BookingDetailPage" />
      </Helmet>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              My Booking
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Booking details.
            </p>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {booking.id}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <Badge
                    status={BookingStatusBadge[booking.status]}
                    text={
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {BookingStatusString[booking.status]}
                      </span>
                    }
                  />
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Room</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {booking.room.name}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {DateTime.fromISO(booking.startTime).toISODate()} (
                  {DateTime.fromISO(booking.startTime).weekdayShort})
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Time</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {DateTime.fromISO(booking.startTime).toISOTime({
                    suppressSeconds: true,
                    includeOffset: false,
                  })}{' '}
                  -{' '}
                  {DateTime.fromISO(booking.endTime).toISOTime({
                    suppressSeconds: true,
                    includeOffset: false,
                  })}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {booking.purpose}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Details</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {booking.details}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
