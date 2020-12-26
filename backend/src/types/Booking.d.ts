import { Optional } from './common';

export interface BookingAttributes {
  id: number;
  userId: number;
  roomId: number;
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreateData {
  roomId: number;
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}
