require('dotenv').config();

export const dbConfig = {
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  database: process.env.DATABASE,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  entities: ['src/entities/**.entity.ts'],
  synchronize: false,
  logging: [],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default dbConfig;
