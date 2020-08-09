/**
 *
 * DashboardPage
 *
 */

import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectDashboardPage } from './selectors';
import { dashboardPageSaga } from './saga';

interface Props {}

export const DashboardPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dashboardPage = useSelector(selectDashboardPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Div></Div>
    </>
  );
});

const Div = styled.div``;
