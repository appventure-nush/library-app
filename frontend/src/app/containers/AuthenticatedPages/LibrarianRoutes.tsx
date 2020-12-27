import React from 'react';
import { Route } from 'react-router-dom';
import TeacherRoutes from './TeacherRoutes';
import { BookingDetailPage } from '../BookingDetailPage';
import { BookingListPage } from '../BookingListPage';

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
