import React from 'react';
import { Route } from 'react-router-dom';

import { CreateBookingPage } from '../../CreateBookingPage';
import { DashboardPage } from '../../DashboardPage';
import { MyBookingDetailPage } from '../../MyBookingDetailPage';
import { MyBookingListPage } from '../../MyBookingListPage';

const StudentRoutes = [
  <Route exact path={process.env.PUBLIC_URL + '/'} component={DashboardPage} />,
  <Route
    exact
    path={process.env.PUBLIC_URL + '/newbooking'}
    component={CreateBookingPage}
  />,
  <Route
    exact
    path={process.env.PUBLIC_URL + '/mybookings'}
    component={MyBookingListPage}
  />,
  <Route
    path={process.env.PUBLIC_URL + '/mybookings/:id'}
    component={MyBookingDetailPage}
  />,
];

export default StudentRoutes;
