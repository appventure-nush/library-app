import database from 'config/database';
import { DateTime } from 'luxon';
import { DataTypes, Model } from 'sequelize';
import { InfringmentAttributes, InfringementCreationAttributes } from 'types/Infringement';
import User from './User';

export default class Infringement
  extends Model<InfringmentAttributes, InfringementCreationAttributes>
  implements InfringmentAttributes {
  public id!: number;
  public userId!: string;
  public details!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Infringement.init(
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
    details: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: 'infringements',
    sequelize: database,
    hooks: {
      afterCreate: (infringement, options) => {
        Infringement.findAll<Infringement>({
          ...options,
          where: { userId: infringement.userId },
        }).then(async infringements => {
          const oneMonthLater = DateTime.local().endOf('days').plus({ months: 1 });
          if (infringements.length >= 2) {
            await User.update(
              { bannedEndTime: oneMonthLater.toJSDate() },
              { where: { id: infringement.userId } },
            );
            await User.update(
              { bannedReason: 'Infringed library rules twice in this term' },
              { where: { id: infringement.userId } },
            );
          }
        });
      },
    },
  },
);
