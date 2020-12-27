import {
  Model,
  DataTypes,
  Association,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
} from 'sequelize';
import database from 'config/database';
import { RoomAttributes, RoomCreationAttributes } from 'types/Room';
import Booking from './Booking';

export default class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
  },
  {
    tableName: 'rooms',
    sequelize: database,
    paranoid: true,
  },
);

Room.hasMany(Booking, {
  sourceKey: 'id',
  foreignKey: 'roomId',
  as: {
    singular: 'booking',
    plural: 'bookings',
  },
});
