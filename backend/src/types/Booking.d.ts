import { Optional } from './common';

export interface BookingAttributes {
  id: number;
  userId: number;
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreateData {
  purpose: string;
  details: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}
