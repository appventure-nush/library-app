import React from 'react';
import { Route } from 'react-router-dom';

import { BookingDetailPage } from '../BookingDetailPage';
import { BookingListPage } from '../BookingListPage';
import { RoomPinPage } from '../RoomPinPage';
import { UserDetailPage } from '../UserDetailPage';
import { UserListPage } from '../UserListPage';
import StaffRoutes from './StaffRoutes';

const LibrarianRoutes = [
  <Route
    exact
    path={process.env.PUBLIC_URL + '/bookings'}
    component={BookingListPage}
  />,
  <Route
    path={process.env.PUBLIC_URL + '/bookings/:id'}
    component={BookingDetailPage}
  />,
  <Route
    path={process.env.PUBLIC_URL + '/rooms/:id/pin'}
    component={RoomPinPage}
  />,
  <Route
    exact
    path={process.env.PUBLIC_URL + '/users'}
    component={UserListPage}
  />,
  <Route
    path={process.env.PUBLIC_URL + '/users/:id'}
    component={UserDetailPage}
  />,
].concat(StaffRoutes);

export default LibrarianRoutes;
