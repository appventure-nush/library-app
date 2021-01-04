import { RoomListData } from 'types/Room';
import { Slot } from 'types/Week';

/* --- STATE --- */
export interface CreateBookingPageState {
  disabledSlots: Slot[];
  bookedSlots: Slot[];
  rooms: RoomListData[];
  currentRoom: number | null;
}

export type ContainerState = CreateBookingPageState;
