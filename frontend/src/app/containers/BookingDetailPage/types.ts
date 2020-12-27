import { BookingViewData } from 'types/Booking';

/* --- STATE --- */
export interface BookingDetailPageState {
  booking: BookingViewData | null;
}

export type ContainerState = BookingDetailPageState;
