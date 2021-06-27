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

export function RoomPinPage() {
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
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-9xl text-gray-500">{roomPinPage.pin}</p>
    </div>
  );
}
