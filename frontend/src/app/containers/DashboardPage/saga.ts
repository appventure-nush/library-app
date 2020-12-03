import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import api from 'app/api';

export function* loadDashboard() {
  const bookings = yield call(api.booking.getOwnBookings);
  yield put(actions.saveBookings(bookings.data));
}

export function* dashboardPageSaga() {
  yield takeLatest(actions.dashboardRequest.type, loadDashboard);
}
