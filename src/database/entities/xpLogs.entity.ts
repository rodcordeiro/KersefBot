import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'kersef_tb_user_xp_log' })
export class UserXpLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  userId!: string;

  @Column({ type: 'varchar' })
  guildId!: string;

  @Column({ type: 'int' })
  amount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relacionamento (opcional, apenas para joins e cascade delete)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'userId', referencedColumnName: 'userId' },
    { name: 'guildId', referencedColumnName: 'guildId' },
  ])
  user?: UserEntity;
}
