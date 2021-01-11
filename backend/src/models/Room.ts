import database from 'config/database';
import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
} from 'sequelize';
import { RoomAttributes, RoomCreationAttributes } from 'types/Room';

import Booking from './Booking';

export default class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes {
  public id!: number;
  public name!: string;
  public checkInPin: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Room.hasMany(Booking, {
      sourceKey: 'id',
      foreignKey: 'roomId',
      as: {
        singular: 'booking',
        plural: 'bookings',
      },
    });
  }

  public getBookings!: HasManyGetAssociationsMixin<Booking>;
  public addBooking!: HasManyAddAssociationMixin<Booking, number>;
  public hasBooking!: HasManyHasAssociationMixin<Booking, number>;
  public countBookings!: HasManyCountAssociationsMixin;
  public createBooking!: HasManyCreateAssociationMixin<Booking>;

  public readonly bookings?: Booking[];

  public static associations: {
    bookings: Association<Room, Booking>;
  };
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    checkInPin: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: 'rooms',
    sequelize: database,
    paranoid: true,
  },
);
