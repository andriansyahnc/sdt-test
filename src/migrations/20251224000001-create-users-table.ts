import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsersTable20251224000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          { name: 'first_name', type: 'varchar', length: '100', isNullable: false },
          { name: 'last_name', type: 'varchar', length: '100', isNullable: false },
          { name: 'date_of_birth', type: 'date', isNullable: false },
          { name: 'location', type: 'varchar', length: '255', isNullable: false },
          { name: 'timezone', type: 'varchar', length: '100', isNullable: false },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
