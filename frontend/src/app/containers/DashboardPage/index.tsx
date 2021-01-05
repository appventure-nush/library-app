import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { getCurrentUser } from '../AuthenticatedPages/selectors';
import DashboardCard from './DashboardCard';
import { dashboardPageSaga } from './saga';
import { selectDashboardPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { Role } from 'types/User';

interface Props {}

export const DashboardPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardPageSaga });

  const dashboardPage = useSelector(selectDashboardPage);
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.dashboardRequest());
    if (currentUser !== null && currentUser.role === Role.STUDENT)
      dispatch(actions.loadOwnUserStats());
  }, [dispatch, currentUser]);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      {dashboardPage.userStats !== null && (
        <Typography variant="h4" gutterBottom>
          Bookings made this week:
          {` ${dashboardPage.userStats.bookedPerWeek}/2`}
        </Typography>
      )}
      {dashboardPage.bookings.length !== 0 && (
        <Typography variant="h5" gutterBottom>
          My Bookings:{' '}
        </Typography>
      )}
      {dashboardPage.bookings.map(booking => (
        <DashboardCard key={booking.id} {...booking} />
      ))}
      {(dashboardPage.userStats === null ||
        dashboardPage.userStats.bookedPerWeek < 2) && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => {
            history.push('/newbooking');
          }}
        >
          New booking
        </Button>
      )}
    </>
  );
});
