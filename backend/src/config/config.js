module.exports = {
  development: {
    username: 'postgres',
    password: 'libraryapp',
    database: 'libraryApp',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
  },
};
