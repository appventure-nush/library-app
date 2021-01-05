import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

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
  timezone: 'Asia/Singapore',
  logging: false,
});

export default database;
