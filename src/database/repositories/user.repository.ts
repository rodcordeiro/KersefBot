import { AppDataSource } from '../index';
import { UserEntity } from '../entities';

export const UserRepository = AppDataSource.getRepository(UserEntity);
