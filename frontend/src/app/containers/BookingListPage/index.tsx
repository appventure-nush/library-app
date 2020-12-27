/**
 *
 * BookingListPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectBookingListPage } from './selectors';
import { bookingListPageSaga } from './saga';
import { Space, Table, Tag } from 'antd';
import { Role, roleString, roleColor } from 'types/User';
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
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Role',
    key: 'role',
    dataIndex: 'role',
    render: (role: Role) => (
      <Tag color={roleColor[role]}>{roleString[role]}</Tag>
    ),
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
        <Link to={`bookings/${record.id}`}>View</Link>
      </Space>
    ),
  },
];

export function BookingListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bookingListPageSaga });

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
                username: booking.user.name,
                role: booking.user.role,
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
