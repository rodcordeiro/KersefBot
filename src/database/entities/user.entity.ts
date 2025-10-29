import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm';

@Entity({ name: 'kersef_tb_user' })
export class UserEntity {
  private interaction_xp: number = 10;
  public level_requirements: number = 15;

  @Generated('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @PrimaryColumn({ type: 'varchar' })
  userId!: string;
  @PrimaryColumn({ type: 'varchar' })
  guildId!: string;

  @Column({ type: 'int', default: 0 })
  xp: number = 0;
  @Column({ type: 'int', default: 1 })
  level: number = 1;

  public calcXp() {
    this.interaction_xp = Math.floor(this.level * this.level) * 2;
  }
  public registerXp(ammount?: number) {
    const total_xp = ammount || this.interaction_xp;
    this.xp += total_xp;
  }
  public getLevel() {
    // const xp = this.xp || 1; // <-- This is a bug, remove it.

    // Use the user's *actual* XP, and check "greater than or equal to"
    while (this.xp >= this.level_requirements) {
      this.level++;
      this.increaseLvlRequirements();
    }
    // Re-calculate the interaction_xp based on the *new* level
    this.calcXp();
  }

  private increaseLvlRequirements() {
    this.level_requirements = Math.floor(
      this.level ** 2 - this.level + 15 + this.level_requirements,
    );
  }
}
