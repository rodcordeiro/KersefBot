import { Between } from 'typeorm';
import { AppDataSource } from '../database';
import {
  UserEntity,
  PowerLevelEntity,
  UserXpLogEntity,
} from '../database/entities';

export class UserService {
  private userRepo = AppDataSource.getRepository(UserEntity);
  private powerRepo = AppDataSource.getRepository(PowerLevelEntity);
  private xpLogRepo = AppDataSource.getRepository(UserXpLogEntity);

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

    await this.xpLogRepo.save(
      this.xpLogRepo.create({
        guildId,
        userId,
        amount: amount || user['interaction_xp'],
      }),
    );
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

  async getPowerlevelRanking(guildId: string) {
    return this.powerRepo.find({
      where: { guildId },
      order: { score: 'DESC' },
      take: 10,
    });
  }

  async isWarLord(guildId: string, userId: string) {
    const user = (
      await this.powerRepo.find({
        where: {
          guildId,
        },
        order: {
          score: 'DESC',
        },
        take: 1,
      })
    ).at(0);
    if (!user) return true;
    if (user.userId === userId) return true;
    return false;
  }

  // 🧾 Novo método — logs dos últimos 7 dias
  async getXpLogsLast7Days(guildId: string, userId?: string) {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const where: Record<string, unknown> = {
      guildId,
      createdAt: Between(sevenDaysAgo, now),
    };
    if (userId) where.userId = userId;
    return this.xpLogRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // 🧮 Estatísticas agregadas (total de XP ganho nos últimos 7 dias)
  async getXpGainedLast7Days(guildId: string, userId: string) {
    const logs = await this.getXpLogsLast7Days(guildId, userId);
    return logs.reduce((total, log) => total + log.amount, 0);
  }

  // 🧹 Novo método — limpeza de logs com mais de 31 dias
  async pruneXpLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 31);

    await this.xpLogRepo
      .createQueryBuilder()
      .delete()
      .from('kersef_tb_xp_log')
      .where('created_at < :cutoff', { cutoff })
      .execute();
  }
}
