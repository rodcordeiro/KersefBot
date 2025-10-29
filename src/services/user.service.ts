import { FindOneOptions } from 'typeorm';
import { UserRepository } from '../database/repositories/user.repository';
import { UserEntity } from '../database/entities';

export class UserServices {
  static async CreateOrUpdate(payload: { id: string }) {
    const guild = await UserRepository.findOneBy({ guildId: payload.id });
    if (!guild) {
      const newUser = UserRepository.create({
        guildId: payload.id,
      });
      return await UserRepository.save(newUser);
    }
    return guild;
  }

  static async Delete(payload: { id: string }) {
    const guild = await UserRepository.findOneBy({ guildId: payload.id });
    if (guild) await UserRepository.delete({ guildId: payload.id });
  }

  static async findOne(options: FindOneOptions<UserEntity>['where']) {
    return await UserRepository.findOneOrFail({
      where: options,
    });
  }

  static async update(payload: UserEntity) {
    const guild = await UserRepository.findOneByOrFail({
      guildId: payload.guildId,
    });
    UserRepository.merge(guild, payload);
    return await UserRepository.save(guild);
  }

  static async registerXp(payload: Partial<UserEntity>) {
    console.log({ payload });
    let user = await UserRepository.findOneBy({
      discordId: payload.discordId,
      guildId: payload.guildId,
    });
    console.log({ user });

    if (!user) user = UserRepository.create(payload);
    console.log({ user });
    user.calcXp();
    user.getLevel();
    user.registerXp();
    console.log({ user });

    return await UserRepository.save(user);
  }
}
