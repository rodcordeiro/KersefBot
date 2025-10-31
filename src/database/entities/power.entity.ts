import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'kersef_tb_power_level' })
export class PowerLevelEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  nick!: string;

  @Column({ type: 'varchar' })
  class!: string;

  @Column({ type: 'varchar' })
  focus!: string;

  @Column({ type: 'int' })
  score!: number;

  @Column({ type: 'varchar' })
  guildId!: string;

  @Column({ type: 'varchar' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn([
    { name: 'guildId', referencedColumnName: 'guildId' },
    { name: 'userId', referencedColumnName: 'userId' },
  ])
  user!: UserEntity;
  /*
   * Hooks
   */
  /*
   * Methods
   */
}
