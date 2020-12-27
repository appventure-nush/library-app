import { Model, DataTypes } from 'sequelize';
import database from '../config/database';
import { BookingAttributes, BookingCreationAttributes } from 'types/Booking';
import Room from './Room';
import User from './User';

export default class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes {
  public id!: number;
  public userId!: number;
  public roomId!: number;
  public purpose!: string;
  public details!: string;
  public startTime!: Date;
  public endTime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purpose: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    details: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'bookings',
    sequelize: database,
    paranoid: true,
  },
);
