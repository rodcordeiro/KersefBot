import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GuildEntity } from './entities';
import { config } from '../common/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  entities: [GuildEntity],
  synchronize: true,
  debug: config.app.DEBUG,
});
