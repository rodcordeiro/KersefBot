import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class XpLogs1761939518295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'kersef_tb_user_xp_log',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'amount', type: 'int', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'guildId', type: 'varchar', isNullable: false },
          { name: 'userId', type: 'varchar', isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'kersef_tb_user_xp_log',
      new TableForeignKey({
        name: 'FK_log_user_guild',
        columnNames: ['guildId'],
        referencedTableName: 'kersef_tb_user',
        referencedColumnNames: ['guildId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'kersef_tb_user_xp_log',
      new TableForeignKey({
        name: 'FK_log_user_user',
        columnNames: ['userId'],
        referencedTableName: 'kersef_tb_user',
        referencedColumnNames: ['userId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    // await queryRunner.query(`
    //       CREATE INDEX IF NOT EXISTS idx_xp_log_guild_user
    //       ON kersef_tb_xp_log (guildId, userId);
    //     `);

    // // Composite index for guildId + created_at (for cleanup and analytics)
    // await queryRunner.query(`
    //       CREATE INDEX IF NOT EXISTS idx_xp_log_guild_date
    //       ON kersef_tb_xp_log (guildId, created_at);
    //     `);

    // // Individual index on userId
    // await queryRunner.query(`
    //       CREATE INDEX IF NOT EXISTS idx_xp_log_user
    //       ON kersef_tb_xp_log (userId);
    //     `);

    // // Individual index on guildId
    // await queryRunner.query(`
    //       CREATE INDEX IF NOT EXISTS idx_xp_log_guild
    //       ON kersef_tb_xp_log (guildId);
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX IF EXISTS idx_xp_log_guild_user;`);
    // await queryRunner.query(`DROP INDEX IF EXISTS idx_xp_log_guild_date;`);
    // await queryRunner.query(`DROP INDEX IF EXISTS idx_xp_log_user;`);
    // await queryRunner.query(`DROP INDEX IF EXISTS idx_xp_log_guild;`);
    await queryRunner.dropForeignKey(
      'kersef_tb_user_xp_log',
      'FK_power_user_guild',
    );
    await queryRunner.dropForeignKey(
      'kersef_tb_user_xp_log',
      'FK_power_user_user',
    );
    await queryRunner.dropTable('kersef_tb_user_xp_log');
  }
}
