import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { actions } from './slice';

export function* loadUser(action: PayloadAction<String>) {
  try {
    const user = yield call(api.users.getUser, action.payload);
    yield put(actions.saveUser(user.data));
  } catch (err) {
    toast.error('Failed to load user');
    console.log(err);
  }
}

export function* loadUserBookings(action: PayloadAction<String>) {
  try {
    const userBookings = yield call(api.users.getUserBookings, action.payload);
    yield put(actions.saveUserBookings(userBookings.data));
  } catch (err) {
    toast.error('Failed to load user bookings');
  }
}

export function* userDetailPageSaga() {
  yield takeLatest(actions.loadUser.type, loadUser);
  yield takeLatest(actions.loadUserBookings.type, loadUserBookings);
}
