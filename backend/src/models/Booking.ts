import database from 'config/database';
import { DataTypes, Model } from 'sequelize';
import {
  BookingAttributes,
  BookingCreationAttributes,
  BookingStatus,
  BookingType,
} from 'types/Booking';

import UserStats from './UserStats';

export default class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes {
  public id!: number;
  public type!: BookingType;
  public status!: BookingStatus;
  public userId!: string;
  public roomId!: number;
  public purpose!: string;
  public details!: string;
  public startTime!: Date;
  public endTime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {}
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
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
    hooks: {
      beforeCreate: (booking, options) => {
        if (booking.type === BookingType.BOOKING)
          UserStats.increment<UserStats>('bookedPerWeek', {
            ...options,
            where: { userId: booking.userId },
          });
      },
    },
  },
);
