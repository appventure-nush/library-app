/**
 *
 * ConsolidatedRoomPinPage
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectConsolidatedRoomPinPage } from './selectors';
import { consolidatedRoomPinPageSaga } from './saga';
import { Grid, Typography } from '@material-ui/core';

interface Props {}

export function ConsolidatedRoomPinPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: consolidatedRoomPinPageSaga });

  const consolidatedRoomPinPage = useSelector(selectConsolidatedRoomPinPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadRoomPins());
    const interval = setInterval(() => {
      dispatch(actions.loadRoomPins());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Grid
      container
      alignItems="center"
      justify="space-evenly"
      style={{ height: '80vh' }}
      spacing={2}
    >
      {consolidatedRoomPinPage.pins.map(pinData => (
        <Grid item xs={6}>
          <Typography variant="h3">{pinData.name}:</Typography>
          <br />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h1">{pinData.checkInPin}</Typography>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
