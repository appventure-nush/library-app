/**
 *
 * BookingListPage
 *
 */

import { Badge, Button, Modal, Space, Table, Tag } from 'antd';
import api from 'app/api';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BookingListViewData,
  BookingStatus,
  BookingStatusBadge,
  BookingStatusString,
} from 'types/Booking';
import { Role, roleColor, roleString } from 'types/User';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { bookingListPageSaga } from './saga';
import { selectBookingListPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';

const { confirm } = Modal;

interface Props {}

export function BookingListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bookingListPageSaga });

  const bookingListPage = useSelector(selectBookingListPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadBookings());
  }, [dispatch]);

  const showCancelConfirm = useCallback(
    (bookingId: number, room: string, time: string) => () => {
      confirm({
        title: 'Do you want to cancel this booking?',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            {room} <br /> {time}
          </div>
        ),
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          api.booking
            .cancelBooking(bookingId)
            .then(() => dispatch(actions.loadBookings()));
        },
      });
    },
    [dispatch],
  );

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingStatus) => (
        <Badge
          status={BookingStatusBadge[status]}
          text={BookingStatusString[status]}
        />
      ),
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
          {record.status === BookingStatus.CONFIRMED && (
            <Button
              type="link"
              danger
              onClick={showCancelConfirm(
                record.id,
                record.roomname,
                `${record.date.toISODate()} (${
                  record.date.weekdayShort
                }) ${record.startTime.toISOTime({
                  suppressSeconds: true,
                  includeOffset: false,
                })} ${record.endTime.toISOTime({
                  suppressSeconds: true,
                  includeOffset: false,
                })}`,
              )}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
                status: booking.status,
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
