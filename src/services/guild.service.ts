import { FindOneOptions } from 'typeorm';
import { GuildRepository } from '../database/repositories/guild.repository';
import { GuildEntity } from '../database/entities/guild.entity';

export class GuildServices {
  static async CreateOrUpdate(payload: { id: string }) {
    const guild = await GuildRepository.findOneBy({ guildId: payload.id });
    if (!guild) {
      const newGuild = GuildRepository.create({
        guildId: payload.id,
      });
      return await GuildRepository.save(newGuild);
    }
    return guild;
  }

  static async Delete(payload: { id: string }) {
    const guild = await GuildRepository.findOneBy({ guildId: payload.id });
    if (guild) await GuildRepository.delete({ guildId: payload.id });
  }

  static async findOne(options: FindOneOptions<GuildEntity>['where']) {
    return await GuildRepository.findOneOrFail({
      where: options,
    });
  }

  static async update(payload: GuildEntity) {
    const guild = await GuildRepository.findOneByOrFail({
      guildId: payload.guildId,
    });
    GuildRepository.merge(guild, payload);
    return await GuildRepository.save(guild);
  }
}
