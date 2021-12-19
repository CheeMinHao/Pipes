import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFieldInOffering1639925794671 implements MigrationInterface {
    name = 'updateFieldInOffering1639925794671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Offering" DROP CONSTRAINT "FK_8d26d5be561474caeaca4be0778"`);
        await queryRunner.query(`ALTER TABLE "Offering" RENAME COLUMN "facultyId" TO "unitId"`);
        await queryRunner.query(`ALTER TABLE "Offering" ADD CONSTRAINT "FK_3c0b8ecb1204a8a5c3f34f6a7aa" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Offering" DROP CONSTRAINT "FK_3c0b8ecb1204a8a5c3f34f6a7aa"`);
        await queryRunner.query(`ALTER TABLE "Offering" RENAME COLUMN "unitId" TO "facultyId"`);
        await queryRunner.query(`ALTER TABLE "Offering" ADD CONSTRAINT "FK_8d26d5be561474caeaca4be0778" FOREIGN KEY ("facultyId") REFERENCES "Unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
