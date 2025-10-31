import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class PowerLevel1761883151323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'kersef_tb_power_level',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'nick', type: 'varchar', isNullable: false },
          { name: 'class', type: 'varchar', isNullable: false },
          { name: 'focus', type: 'varchar', isNullable: false },
          { name: 'score', type: 'int', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          { name: 'guildId', type: 'varchar', isNullable: false },
          { name: 'userId', type: 'varchar', isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'kersef_tb_power_level',
      new TableForeignKey({
        name: 'FK_power_user_guild',
        columnNames: ['guildId'],
        referencedTableName: 'kersef_tb_user',
        referencedColumnNames: ['guildId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'kersef_tb_power_level',
      new TableForeignKey({
        name: 'FK_power_user_user',
        columnNames: ['userId'],
        referencedTableName: 'kersef_tb_user',
        referencedColumnNames: ['userId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'kersef_tb_power_level',
      'FK_power_user_guild',
    );
    await queryRunner.dropForeignKey(
      'kersef_tb_power_level',
      'FK_power_user_user',
    );
    await queryRunner.dropTable('kersef_tb_power_level');
  }
}
