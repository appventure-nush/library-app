import { RoomListData } from 'types/Room';
import { RawDisabledSlot, RawOccupiedSlot } from 'types/Week';

/* --- STATE --- */
export interface CreateBookingPageState {
  disabledSlots: RawDisabledSlot[];
  occupiedSlots: RawOccupiedSlot[];
  rooms: RoomListData[];
  currentRoom: number | null;
}

export type ContainerState = CreateBookingPageState;
