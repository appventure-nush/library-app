/**
 *
 * BookingDetailPage
 *
 */

import { Badge, Descriptions, Space, Tag } from 'antd';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { BookingStatusBadge, BookingStatusString } from 'types/Booking';
import { roleColor, roleString } from 'types/User';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { Breadcrumbs, Link, Typography } from '@material-ui/core';

import { bookingDetailPageSaga } from './saga';
import { selectBookingDetailPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';

interface Props {}

export function BookingDetailPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bookingDetailPageSaga });

  const { booking } = useSelector(selectBookingDetailPage);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.loadBooking(id));
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title>Booking Info</title>
        <meta name="description" content="Description of BookingDetailPage" />
      </Helmet>
      <Breadcrumbs separator="›" style={{ marginBottom: 20 }}>
        <Link
          color="inherit"
          component="button"
          onClick={() => history.push('/bookings')}
        >
          Bookings
        </Link>
        {booking && <Typography color="textPrimary">{booking.id}</Typography>}
      </Breadcrumbs>
      {booking && (
        <Descriptions bordered>
          <Descriptions.Item label="ID">{booking.id}</Descriptions.Item>
          <Descriptions.Item label="Room" span={2}>
            {booking.room.name}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {DateTime.fromISO(booking.startTime).toISODate()} (
            {DateTime.fromISO(booking.startTime).weekdayShort})
          </Descriptions.Item>
          <Descriptions.Item label="Start time">
            {DateTime.fromISO(booking.startTime).toISOTime({
              suppressSeconds: true,
              includeOffset: false,
            })}
          </Descriptions.Item>
          <Descriptions.Item label="End Time">
            {DateTime.fromISO(booking.endTime).toISOTime({
              suppressSeconds: true,
              includeOffset: false,
            })}
          </Descriptions.Item>
          <Descriptions.Item label="User">
            {booking.user.name}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Tag color={roleColor[booking.user.role]}>
              {roleString[booking.user.role]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Purpose">
            {booking.purpose}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Badge
              status={BookingStatusBadge[booking.status]}
              text={BookingStatusString[booking.status]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Details" span={3}>
            <Space wrap style={{ width: '50vw' }}>
              {booking.details}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      )}
    </>
  );
}
