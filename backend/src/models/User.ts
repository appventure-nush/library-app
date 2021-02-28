import database from 'config/database';
import { sign } from 'jsonwebtoken';
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
import { BearerTokenType } from 'types/tokens';
import { Role, UserAttributes, UserCreationAttributes } from 'types/User';

import Booking from './Booking';
import Infringement from './Infringement';
import UserStats from './UserStats';

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;
  public azureOid!: string;
  public name!: string;
  public email!: string;
  public role!: Role;

  public bannedReason: string | null;
  public bannedEndTime: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    User.hasMany(Infringement, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: {
        singular: 'infringement',
        plural: 'infringements',
      },
      onDelete: 'CASCADE',
    });

    User.hasMany(Booking, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: {
        singular: 'booking',
        plural: 'bookings',
      },
      onDelete: 'CASCADE',
    });

    User.hasOne(UserStats, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: {
        singular: 'userStats',
        plural: 'userStats',
      },
      onDelete: 'CASCADE',
    });
  }

  public getBookings!: HasManyGetAssociationsMixin<Booking>;
  public addBooking!: HasManyAddAssociationMixin<Booking, number>;
  public hasBooking!: HasManyHasAssociationMixin<Booking, number>;
  public countBookings!: HasManyCountAssociationsMixin;
  public createBooking!: HasManyCreateAssociationMixin<Booking>;

  public getInfringements!: HasManyGetAssociationsMixin<Infringement>;
  public addInfringement!: HasManyAddAssociationMixin<Infringement, number>;
  public hasInfringement!: HasManyHasAssociationMixin<Infringement, number>;
  public countInfringements!: HasManyCountAssociationsMixin;
  public createInfringement!: HasManyCreateAssociationMixin<Infringement>;

  public readonly bookings?: Booking[];
  public readonly infringements?: Infringement[];

  public static associations: {
    bookings: Association<User, Booking>;
    infringements: Association<User, Infringement>;
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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
    },
    azureOid: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
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
    bannedReason: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    bannedEndTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize: database,
    paranoid: true,
  },
);
