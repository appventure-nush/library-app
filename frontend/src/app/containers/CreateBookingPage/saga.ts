import { PayloadAction } from '@reduxjs/toolkit';
import api from 'app/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

export function* loadCurrentWeekSlots(
  action: PayloadAction<{ roomId: number; delta: number }>,
) {
  const { roomId, delta } = action.payload;
  const bookings = yield call(api.week.getCurrentWeekSlots, roomId, delta);
  yield put(actions.saveCurrentWeekSlots(bookings.data));
}

export function* loadBookableRooms() {
  const rooms = yield call(api.room.getBookableRooms);
  yield put(actions.saveBookableRooms(rooms.data));
  if (rooms.length !== 0) yield put(actions.updateCurrentRoom(0));
}

export function* createBookingPageSaga() {
  yield takeLatest(actions.loadCurrentWeekSlots.type, loadCurrentWeekSlots);
  yield takeLatest(actions.loadBookableRooms.type, loadBookableRooms);
}
