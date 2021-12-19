import {MigrationInterface, QueryRunner} from "typeorm";

export class updateSemesterName1639932095099 implements MigrationInterface {
    name = 'updateSemesterName1639932095099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Semester" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."SemesterId"`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD CONSTRAINT "UQ_908bf5f49332b0dc75c01a5803c" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Semester" DROP CONSTRAINT "UQ_908bf5f49332b0dc75c01a5803c"`);
        await queryRunner.query(`ALTER TABLE "Semester" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."SemesterId" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`ALTER TABLE "Semester" ADD "name" "public"."SemesterId" NOT NULL`);
    }

}
