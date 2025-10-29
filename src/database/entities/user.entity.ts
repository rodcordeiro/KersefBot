import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'kersef_tb_user' })
export class UserEntity extends BaseEntity {
  private interaction_xp: number = 10;
  public level_requirements: number = 1;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  discordId!: string;
  @Column({ type: 'varchar' })
  guildId!: string;
  @Column({ type: 'int', default: 0 })
  xp: number = 0;
  @Column({ type: 'int', default: 1 })
  level: number = 1;

  public calcXp() {
    this.interaction_xp = Math.floor(this.level * this.level) * 2;
  }
  public registerXp(modifier?: number) {
    const modifier_xp = modifier || this.interaction_xp;
    this.xp += this.interaction_xp + Math.floor(Math.random() * modifier_xp);
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
