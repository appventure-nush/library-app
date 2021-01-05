import api from 'app/api';
import { call, put, takeLatest } from 'redux-saga/effects';

import { actions } from './slice';

export function* loadDashboard() {
  const bookings = yield call(api.booking.getUpComingBookings);
  yield put(actions.saveBookings(bookings.data));
}

export function* loadOwnUserStats() {
  const userStats = yield call(api.users.getOwnUserStats);
  yield put(actions.saveUserStats(userStats.data));
}

export function* dashboardPageSaga() {
  yield takeLatest(actions.dashboardRequest.type, loadDashboard);
  yield takeLatest(actions.loadOwnUserStats.type, loadOwnUserStats);
}
