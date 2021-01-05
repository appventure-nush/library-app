import React from 'react';
import { Route } from 'react-router-dom';

import { BookingDetailPage } from '../BookingDetailPage';
import { BookingListPage } from '../BookingListPage';
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
].concat(TeacherRoutes);

export default LibrarianRoutes;
