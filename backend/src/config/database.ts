import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import Booking, { initBooking } from '../models/Booking';
import User, { associateUser, initUser } from '../models/User';

switch (process.env.NODE_ENV) {
  case 'development':
    config({ path: '.env.development' });
    break;
}

const {
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DBNAME,
} = process.env;

const database = new Sequelize(POSTGRES_DBNAME, POSTGRES_USERNAME, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  dialect: 'postgres',
});

export const initDatabase = () => {
  initUser(database);
  initBooking(database);

  associateUser();

  User.sync({ force: true }).then(() => console.log('[Database] User table created'));
  Booking.sync({ force: true }).then(() => console.log('[Database] Booking table created'));
};
