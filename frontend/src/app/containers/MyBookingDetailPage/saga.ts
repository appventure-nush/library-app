import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { actions } from '../BookingDetailPage/slice';

export function* loadBooking(action: PayloadAction<String>) {
  try {
    const booking = yield call(api.booking.getBooking, action.payload);
    yield put(actions.saveBooking(booking.data));
  } catch (err) {
    toast.error('Failed to load bookings');
  }
}

export function* myBookingDetailPageSaga() {
  yield takeLatest(actions.loadBooking.type, loadBooking);
}
