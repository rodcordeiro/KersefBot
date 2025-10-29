import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrColumn1761767319956 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'kersef_tb_user',
            new TableColumn({
                name: 'power_level',
                type: 'int',
                isNullable: true,
            }),
        );
        await queryRunner.addColumn(
            'kersef_tb_user',
            new TableColumn({
                name: 'last_update_power_level',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('kersef_tb_user', 'power_level');
        await queryRunner.dropColumn(
            'kersef_tb_user',
            'last_update_power_level',
        );
    }
}
