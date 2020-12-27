import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from '../BookingListPage/slice';

export function* fetchBookings() {
  try {
    const bookings = yield call(api.booking.getMyBookings);
    yield put(actions.saveBookings(bookings.data));
  } catch (err) {
    toast.error('Failed to load bookings');
  }
}

export function* myBookingListPageSaga() {
  yield takeLatest(actions.loadBookings.type, fetchBookings);
}
