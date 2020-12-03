import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectDashboardPage } from './selectors';
import { dashboardPageSaga } from './saga';
import { Helmet } from 'react-helmet-async';
import DashboardCard from './DashboardCard';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { actions } from './slice';
interface Props {}

export const DashboardPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardPageSaga });

  const dashboardPage = useSelector(selectDashboardPage);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.dashboardRequest());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Dashboard Page</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      {dashboardPage.bookings.length !== 0 && (
        <Typography variant="h5" gutterBottom>
          My Bookings:{' '}
        </Typography>
      )}
      {dashboardPage.bookings.map(booking => (
        <DashboardCard key={booking.id} {...booking} />
      ))}
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
    </>
  );
});
