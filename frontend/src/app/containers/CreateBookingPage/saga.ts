import api from 'app/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

export function* loadCurrentWeekSlots() {
  const bookings = yield call(api.week.getCurrentWeekSlots);
  yield put(actions.saveCurrentWeekSlots(bookings.data));
}

export function* createBookingPageSaga() {
  yield takeLatest(actions.loadCurrentWeekSlots.type, loadCurrentWeekSlots);
}
