import {MigrationInterface, QueryRunner} from "typeorm";

export class removeNullable1640185579095 implements MigrationInterface {
    name = 'removeNullable1640185579095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Semester" ALTER COLUMN "code" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Semester" ALTER COLUMN "code" DROP NOT NULL`);
    }

}
