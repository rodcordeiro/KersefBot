import { FindOneOptions } from 'typeorm';
import { GuildEntity } from '../database/entities/guild.entity';
import { AppDataSource } from '../database';

export class GuildServices {
  private _repository = AppDataSource.getRepository(GuildEntity);

  async CreateOrUpdate(payload: { id: string }) {
    const guild = await this._repository.findOneBy({ guildId: payload.id });
    if (!guild) {
      const newGuild = this._repository.create({
        guildId: payload.id,
      });
      return await this._repository.save(newGuild);
    }
    return guild;
  }

  async Delete(payload: { id: string }) {
    const guild = await this._repository.findOneBy({ guildId: payload.id });
    if (guild) await this._repository.delete({ guildId: payload.id });
  }

  async findOne(options: FindOneOptions<GuildEntity>['where']) {
    return await this._repository.findOneOrFail({
      where: options,
    });
  }

  async update(payload: GuildEntity) {
    const guild = await this._repository.findOneByOrFail({
      guildId: payload.guildId,
    });
    this._repository.merge(guild, payload);
    return await this._repository.save(guild);
  }
}
