import { sign } from 'jsonwebtoken';
import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
} from 'sequelize';
import database from 'config/database';
import { BearerTokenType } from 'types/tokens';
import { UserCreationAttributes, UserAttributes, Role } from 'types/User';
import Booking from './Booking';

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public azureOid!: string;
  public name!: string;
  public email!: string;
  public role!: Role;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getBookings!: HasManyGetAssociationsMixin<Booking>;
  public addBooking!: HasManyAddAssociationMixin<Booking, number>;
  public hasBooking!: HasManyHasAssociationMixin<Booking, number>;
  public countBookings!: HasManyCountAssociationsMixin;
  public createBooking!: HasManyCreateAssociationMixin<Booking>;

  public readonly bookings?: Booking[];

  public static associations: {
    bookings: Association<User, Booking>;
  };

  private createBearerToken = (tokenType: BearerTokenType, expiresIn: string) => {
    const payload = {
      tokenType,
      userId: this.id,
    };
    const token = sign(payload, process.env.JWT_SECRET!, { expiresIn });
    return token;
  };

  createAuthenticationTokens = () => {
    const accessToken = this.createBearerToken(BearerTokenType.AccessToken, '5m');
    const refreshToken = this.createBearerToken(BearerTokenType.RefreshToken, '7 days');
    return { accessToken, refreshToken };
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    azureOid: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize: database,
    paranoid: true,
  },
);

User.hasMany(Booking, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: {
    singular: 'booking',
    plural: 'bookings',
  },
});
