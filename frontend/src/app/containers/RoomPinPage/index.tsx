/**
 *
 * RoomPinPage
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectRoomPinPage } from './selectors';
import { roomPinPageSaga } from './saga';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';

interface Props {}

export function RoomPinPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: roomPinPageSaga });

  const { id } = useParams<{ id: string }>();

  const roomPinPage = useSelector(selectRoomPinPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadRoomPin(id));
    const interval = setInterval(() => {
      dispatch(actions.loadRoomPin(id));
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, id]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Typography variant="h1" component="h2">
        {roomPinPage.pin}
      </Typography>
    </div>
  );
}
