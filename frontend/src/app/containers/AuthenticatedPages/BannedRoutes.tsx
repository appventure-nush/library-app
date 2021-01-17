import React from 'react';
import { Route } from 'react-router-dom';

import { BannedPage } from '../BannedPage';
import { MyBookingDetailPage } from '../MyBookingDetailPage';
import { MyBookingListPage } from '../MyBookingListPage';

const StudentRoutes = [
  <Route exact path={process.env.PUBLIC_URL + '/'} component={BannedPage} />,
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
