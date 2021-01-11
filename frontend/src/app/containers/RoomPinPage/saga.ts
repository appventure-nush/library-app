import { PayloadAction } from '@reduxjs/toolkit';
import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

export function* loadBooking(action: PayloadAction<String>) {
  try {
    const pin = yield call(api.room.getRoomPin, action.payload);
    yield put(actions.saveRoomPin(pin.data));
  } catch (err) {
    toast.error('Failed to load room pin');
  }
}

export function* roomPinPageSaga() {
  yield takeLatest(actions.loadRoomPin.type, loadBooking);
}
