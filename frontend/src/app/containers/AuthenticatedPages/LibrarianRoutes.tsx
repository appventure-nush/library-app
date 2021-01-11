import React from 'react';
import { Route } from 'react-router-dom';

import { BookingDetailPage } from '../BookingDetailPage';
import { BookingListPage } from '../BookingListPage';
import { RoomPinPage } from '../RoomPinPage';
import TeacherRoutes from './TeacherRoutes';

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
].concat(TeacherRoutes);

export default LibrarianRoutes;
