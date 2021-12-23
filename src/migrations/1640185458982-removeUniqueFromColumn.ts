import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUniqueFromColumn1640185458982 implements MigrationInterface {
    name = 'removeUniqueFromColumn1640185458982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Unit" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Unit" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Semester" DROP CONSTRAINT "UQ_908bf5f49332b0dc75c01a5803c"`);
        await queryRunner.query(`ALTER TABLE "Semester" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD "code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD CONSTRAINT "UQ_ced45521959f8b9a11094c5fa84" UNIQUE ("code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Semester" DROP CONSTRAINT "UQ_ced45521959f8b9a11094c5fa84"`);
        await queryRunner.query(`ALTER TABLE "Semester" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD "code" character varying`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD CONSTRAINT "UQ_908bf5f49332b0dc75c01a5803c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "Unit" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Unit" ADD "name" character varying(500) NOT NULL`);
    }

}
