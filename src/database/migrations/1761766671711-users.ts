import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Users1761766671711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'kersef_tb_user',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: false,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'guildId',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'xp',
            type: 'int',
            default: 0,
          },
          {
            name: 'level',
            type: 'int',
            default: 1,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'kersef_tb_user',
      new TableIndex({
        name: 'IDX_user_guild_xp',
        columnNames: ['guildId', 'xp'],
      }),
    );

    await queryRunner.createIndex(
      'kersef_tb_user',
      new TableIndex({
        name: 'IDX_user_guild_name',
        columnNames: ['guildId', 'name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('kersef_tb_user', 'IDX_user_guild_xp');
    await queryRunner.dropIndex('kersef_tb_user', 'IDX_user_guild_name');
    await queryRunner.dropTable('kersef_tb_user');
  }
}
