require('dotenv').config();

export const dbConfig = {
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DATABASE,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  entities: [__dirname + '/../entities/**.entity{.ts,.js}'],
  synchronize: false,
  logging: [],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default dbConfig;
