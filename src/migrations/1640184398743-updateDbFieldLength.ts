import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateDbFieldLength1640184398743 implements MigrationInterface {
  name = 'updateDbFieldLength1640184398743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Semester" RENAME COLUMN "fullname" TO "code"`,
    );
    await queryRunner.query(`ALTER TABLE "Unit" DROP COLUMN "overview"`);
    await queryRunner.query(
      `ALTER TABLE "Unit" ADD "overview" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Unit" DROP COLUMN "overview"`);
    await queryRunner.query(
      `ALTER TABLE "Unit" ADD "overview" character varying(500) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Semester" RENAME COLUMN "code" TO "fullname"`,
    );
  }
}
