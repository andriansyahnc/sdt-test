import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWishSentLog20251225000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wish_sent_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          { name: 'userId', type: 'int', isNullable: false, unsigned: true },
          { name: 'type', type: 'enum', enum: ['birthday'], isNullable: false },
          { name: 'sendDate', type: 'datetime', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['sent', 'failed', 'pending', 'in_progress'],
            isNullable: false,
          },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'wish_sent_logs',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wish_sent_logs');
  }
}
