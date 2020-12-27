/**
 *
 * BookingListPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from '../BookingListPage/slice';
import { selectBookingListPage } from '../BookingListPage/selectors';
import { myBookingListPageSaga } from './saga';
import { Space, Table } from 'antd';
import { BookingListViewData } from 'types/Booking';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

interface Props {}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Room',
    dataIndex: 'roomname',
    key: 'roomname',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (time: DateTime) => (
      <div>{`${time.toISODate()} (${time.weekdayShort})`}</div>
    ),
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (time: DateTime) => (
      <div>
        {time.toISOTime({
          suppressSeconds: true,
          includeOffset: false,
        })}
      </div>
    ),
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
    render: (time: DateTime) => (
      <div>
        {time.toISOTime({
          suppressSeconds: true,
          includeOffset: false,
        })}
      </div>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link to={`/mybookings/${record.id}`}>View</Link>
      </Space>
    ),
  },
];

export function MyBookingListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: myBookingListPageSaga });

  const bookingListPage = useSelector(selectBookingListPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadBookings());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Bookings</title>
        <meta name="description" content="Description of BookingListPage" />
      </Helmet>
      <div style={{ height: 400, width: '100%' }}>
        <Table
          columns={columns}
          dataSource={bookingListPage.bookings.map(
            (booking: BookingListViewData, index: number) => {
              return {
                key: index,
                id: booking.id,
                roomname: booking.room.name,
                date: DateTime.fromISO(booking.startTime),
                startTime: DateTime.fromISO(booking.startTime),
                endTime: DateTime.fromISO(booking.endTime),
              };
            },
          )}
        />
      </div>
    </>
  );
}
