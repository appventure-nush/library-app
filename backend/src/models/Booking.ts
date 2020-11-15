import { Model, DataTypes } from 'sequelize';
import { BookingAttributes, BookingCreationAttributes } from 'types/Booking';
import { database } from '../config/database';

export default class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes {
  public id: number;
  public userId: number;
  public title: string;
  public startTime: Date;
  public endTime: Date;

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
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.SMALLINT,
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

Booking.sync({ force: true }).then(() => console.log('[Database] Booking table created'));
