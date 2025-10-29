import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'kersef_tb_guild' })
export class GuildEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  guildId!: string;

  @Column({ type: 'varchar' })
  name!: string;
}
