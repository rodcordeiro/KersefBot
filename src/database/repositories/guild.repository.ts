import { AppDataSource } from '../index';
import { GuildEntity } from '../entities/guild.entity';

export const GuildRepository = AppDataSource.getRepository(GuildEntity);
