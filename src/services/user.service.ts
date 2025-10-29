import { AppDataSource } from '../database';
import { UserEntity } from '../database/entities';

export class UserService {
  private userRepo = AppDataSource.getRepository(UserEntity);

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
}
