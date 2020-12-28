import { Slot } from 'types/Week';

/* --- STATE --- */
export interface CreateBookingPageState {
  disabledSlots: Slot[];
  bookedSlots: Slot[];
}

export type ContainerState = CreateBookingPageState;
