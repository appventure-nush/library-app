import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

export function* loadRoomPins() {
  try {
    const pin = yield call(api.room.getRoomPins);
    yield put(actions.saveRoomPins(pin.data));
  } catch (err) {
    toast.error('Failed to load room pin');
  }
}

export function* consolidatedRoomPinPageSaga() {
  yield takeLatest(actions.loadRoomPins.type, loadRoomPins);
}
