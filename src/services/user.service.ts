import { AppDataSource } from '../database';
import { UserEntity, PowerLevelEntity } from '../database/entities';

export class UserService {
  private userRepo = AppDataSource.getRepository(UserEntity);
  private powerRepo = AppDataSource.getRepository(PowerLevelEntity);

  async register(payload: Partial<UserEntity>) {
    const user = await this.userRepo.findOneBy({
      guildId: payload.guildId,
      userId: payload.userId,
    });
    if (user) return user;
    const newUser = this.userRepo.create(payload);
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findById(guildId: string, userId: string) {
    return await this.userRepo.findOneByOrFail({ guildId, userId });
  }

  async getOrCreate(guildId: string, userId: string) {
    let user = await this.userRepo.findOneBy({ guildId, userId });
    if (!user) {
      user = this.userRepo.create({ guildId, userId });
      await this.userRepo.save(user);
    }
    return user;
  }

  async addXp(guildId: string, userId: string, amount?: number) {
    const user = await this.getOrCreate(guildId, userId);
    user.getLevel();
    user.registerXp(amount);
    user.getLevel();
    await this.userRepo.save(user);
    return user;
  }

  async getLeaderboard(guildId: string) {
    return this.userRepo.find({
      where: { guildId },
      order: { level: 'DESC', xp: 'DESC' },
      take: 10,
    });
  }
  async registerPowerLevel(payload: Partial<PowerLevelEntity>) {
    const { nick, guildId, userId } = payload;

    if (!nick || !guildId || !userId) {
      throw new Error(
        'nick, guildId and userId are required to register a power level.',
      );
    }

    // Try to find existing entry
    const existing = await this.powerRepo.findOne({
      where: { nick, guildId, userId },
    });

    if (existing) {
      // Merge updated data (score or any other field)
      this.powerRepo.merge(existing, payload);
      return await this.powerRepo.save(existing);
    }

    // Create a new one if not found
    const entity = this.powerRepo.create(payload);
    return await this.powerRepo.save(entity);
  }
}
