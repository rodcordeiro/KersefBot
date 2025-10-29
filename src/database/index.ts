import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { config } from '../common/config';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, './entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/**/*.{ts,js}')],
  migrationsRun: true,
  migrationsTableName: 'kersef_migrations',
  debug: config.app.DEBUG,
});
