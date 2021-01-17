import database from 'config/database';
import { DataTypes, Model } from 'sequelize';
import { UserStatsAttributes, UserStatsCreationAttributes } from 'types/UserStats';

import User from './User';

export default class UserStats
  extends Model<UserStatsAttributes, UserStatsCreationAttributes>
  implements UserStatsAttributes {
  public id!: number;
  public userId!: string;
  public bookedPerWeek!: number;
  public infringement!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    UserStats.belongsTo(User, { foreignKey: { name: 'userId' } });
  }
}

UserStats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bookedPerWeek: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
    },
    infringement: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: 'userStats',
    sequelize: database,
    paranoid: true,
  },
);
