import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'kersef_tb_user' })
export class UserEntity extends BaseEntity {
  private interaction_xp: number = 0;
  public level_requirements: number = 0;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  discordId!: string;
  @Column({ type: 'varchar' })
  guildId!: string;
  @Column({ type: 'int', default: 0 })
  xp!: number;
  @Column({ type: 'int', default: 1 })
  level!: number;

  public calcXp() {
    this.interaction_xp = Math.floor(this.level * this.level) * 2;
  }
  public registerXp() {
    this.xp +=
      this.interaction_xp + Math.floor(Math.random() * this.interaction_xp);
  }
  public getLevel() {
    const xp = this.xp || 1;
    while (xp > this.level_requirements) {
      this.level++;
      this.increaseLvlRequirements();
    }
    this.calcXp();
  }

  private increaseLvlRequirements() {
    this.level_requirements = Math.floor(
      this.level ** 2 - this.level + 15 + this.level_requirements,
    );
  }
}
