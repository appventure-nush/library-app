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
import { Table, Tag } from 'antd';
import { Role, roleString } from 'types/User';
import { BookingListViewData } from 'types/Booking';
import { DateTime } from 'luxon';
import { getTimeString } from 'app/components/TimeSlotPicker/utils';

interface Props {}

const roleColor: Record<Role, string> = {
  1: 'green',
  11: 'volcano',
  12: 'geekblue',
  100: 'gold',
};

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
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
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
        <title>BookingListPage</title>
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
                startTime: getTimeString(DateTime.fromISO(booking.startTime)),
                endTime: getTimeString(DateTime.fromISO(booking.endTime)),
              };
            },
          )}
        />
      </div>
    </>
  );
}
