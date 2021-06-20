import { Badge, Button, Modal, Space, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookingListViewData,
  BookingStatus,
  BookingStatusBadge,
  BookingStatusString,
} from 'types/Booking';
import { selectUserBookings } from '../selectors';
import { actions } from '../slice';
import api from 'app/api';
import { Link } from 'react-router-dom';

const { confirm } = Modal;

interface UserBookingsTableProps {
  userId: String;
}

const UserBookingsTable: React.FC<UserBookingsTableProps> = props => {
  const { userId } = props;

  const userBookings = useSelector(selectUserBookings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadUserBookings(userId));
  }, [dispatch, userId]);

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
            .then(() => dispatch(actions.loadUserBookings(userId)));
        },
      });
    },
    [dispatch, userId],
  );

  const columns = [
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
      filters: [
        {
          text: 'Auto-cancelled',
          value: BookingStatus.AUTOCANCELLED,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Room',
      dataIndex: 'roomname',
      key: 'roomname',
      filters: [
        {
          text: 'Lary 0',
          value: 'Lary 0',
        },
        {
          text: 'Lary 1',
          value: 'Lary 1',
        },
        {
          text: 'Lemma 2',
          value: 'Lemma 2',
        },
        {
          text: 'Lemma 3',
          value: 'Lemma 3',
        },
      ],
      onFilter: (value, record) => record.roomname === value,
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
    <div className="w-full">
      <Table
        columns={columns}
        pagination={{ pageSize: 3 }}
        dataSource={userBookings.map(
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
  );
};

export default UserBookingsTable;
