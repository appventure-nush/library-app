/**
 *
 * BookingDetailPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectBookingDetailPage } from './selectors';
import { bookingDetailPageSaga } from './saga';
import { Descriptions, Badge, Space, Tag } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import { roleString, roleColor } from 'types/User';

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
            <Badge status="processing" text="Confirmed" />
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
