import { Optional } from './common';

export interface BookingAttributes {
  id: number;
  userId: number;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}
