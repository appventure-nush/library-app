import React from 'react';
import { Route } from 'react-router-dom';
import { CreateBookingPage } from '../CreateBookingPage';
import { DashboardPage } from '../DashboardPage';

const StudentRoutes = [
  <Route exact path={process.env.PUBLIC_URL + '/'} component={DashboardPage} />,
  <Route
    exact
    path={process.env.PUBLIC_URL + '/newbooking'}
    component={CreateBookingPage}
  />,
];

export default StudentRoutes;
