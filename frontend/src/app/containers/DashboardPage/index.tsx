import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectDashboardPage } from './selectors';
import { dashboardPageSaga } from './saga';
import { Helmet } from 'react-helmet-async';
import DashboardCard from './DashboardCard';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
interface Props {}

export const DashboardPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboardPage = useSelector(selectDashboardPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
      <Helmet>
        <title>Dashboard Page</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      {dashboardPage.bookings.map(booking => (
        <DashboardCard />
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
