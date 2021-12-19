import {MigrationInterface, QueryRunner} from "typeorm";

export class initDB1639925251613 implements MigrationInterface {
    name = 'initDB1639925251613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Campus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "location" character varying(50) NOT NULL, CONSTRAINT "UQ_c0d38074f2d1981bfacecdcb805" UNIQUE ("location"), CONSTRAINT "PK_7a205bb1a349738d91c01d7443c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Faculty" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_afe703a5c16de03492892011b34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseCode" character varying NOT NULL, "name" character varying NOT NULL, "facultyId" uuid, CONSTRAINT "PK_2132e2054a5c04b038320b38c11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b0332672b01311a9ad54856b2b" ON "Course" ("courseCode") `);
        await queryRunner.query(`CREATE TABLE "Unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitCode" character varying NOT NULL, "name" character varying(500) NOT NULL, "overview" character varying(500) NOT NULL, "creditPoints" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "facultyId" uuid, CONSTRAINT "UQ_af53fafd91f97c6207958929ccd" UNIQUE ("unitCode"), CONSTRAINT "PK_0a83556fc363a57bdeee23f9a9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CoreUnits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid, "unitId" uuid, CONSTRAINT "PK_7d22fef0d5b10f51c279af6e18d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."SemesterId" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`CREATE TABLE "Semester" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."SemesterId" NOT NULL, CONSTRAINT "PK_db80423c721bcee4712a4b57ee5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Offering" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "facultyId" uuid, "semesterId" uuid, "campusId" uuid, CONSTRAINT "PK_0509382207c83c0b7b18b722e80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Student" ("id" character varying NOT NULL, "surname" character varying NOT NULL, "givenName" character varying NOT NULL, "intake" character varying NOT NULL, "courseId" uuid, "campusId" uuid, CONSTRAINT "PK_dc3573f6f2de5aa3aefca0c1f1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Grades" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22')`);
        await queryRunner.query(`CREATE TABLE "Enrolment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commencementDate" date NOT NULL, "grades" "public"."Grades" NOT NULL, "marks" integer NOT NULL, "year" integer NOT NULL, "studentId" character varying, "offeringId" uuid, CONSTRAINT "PK_09f671550a605c2b521e029f698" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Course" ADD CONSTRAINT "FK_6982cbb190d774cdc0968521d56" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Unit" ADD CONSTRAINT "FK_596e2364d7cd01fb2abd2e5bf5f" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CoreUnits" ADD CONSTRAINT "FK_dc791403e1cb60033eac9dec50c" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CoreUnits" ADD CONSTRAINT "FK_dd397fe17e1af59037d5f87663f" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offering" ADD CONSTRAINT "FK_8d26d5be561474caeaca4be0778" FOREIGN KEY ("facultyId") REFERENCES "Unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offering" ADD CONSTRAINT "FK_40b582c9a9401ea774615fc5a51" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offering" ADD CONSTRAINT "FK_a555535d097da4d386bdf3796e9" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Student" ADD CONSTRAINT "FK_abd7f5c20b819d04fb579be9fdc" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Student" ADD CONSTRAINT "FK_8530831ca963abd5b43a6759d2e" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrolment" ADD CONSTRAINT "FK_ac4c2d6f7849e62eff0216e616a" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrolment" ADD CONSTRAINT "FK_2ecfafde80910a9696dacaa37b8" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Enrolment" DROP CONSTRAINT "FK_2ecfafde80910a9696dacaa37b8"`);
        await queryRunner.query(`ALTER TABLE "Enrolment" DROP CONSTRAINT "FK_ac4c2d6f7849e62eff0216e616a"`);
        await queryRunner.query(`ALTER TABLE "Student" DROP CONSTRAINT "FK_8530831ca963abd5b43a6759d2e"`);
        await queryRunner.query(`ALTER TABLE "Student" DROP CONSTRAINT "FK_abd7f5c20b819d04fb579be9fdc"`);
        await queryRunner.query(`ALTER TABLE "Offering" DROP CONSTRAINT "FK_a555535d097da4d386bdf3796e9"`);
        await queryRunner.query(`ALTER TABLE "Offering" DROP CONSTRAINT "FK_40b582c9a9401ea774615fc5a51"`);
        await queryRunner.query(`ALTER TABLE "Offering" DROP CONSTRAINT "FK_8d26d5be561474caeaca4be0778"`);
        await queryRunner.query(`ALTER TABLE "CoreUnits" DROP CONSTRAINT "FK_dd397fe17e1af59037d5f87663f"`);
        await queryRunner.query(`ALTER TABLE "CoreUnits" DROP CONSTRAINT "FK_dc791403e1cb60033eac9dec50c"`);
        await queryRunner.query(`ALTER TABLE "Unit" DROP CONSTRAINT "FK_596e2364d7cd01fb2abd2e5bf5f"`);
        await queryRunner.query(`ALTER TABLE "Course" DROP CONSTRAINT "FK_6982cbb190d774cdc0968521d56"`);
        await queryRunner.query(`DROP TABLE "Enrolment"`);
        await queryRunner.query(`DROP TYPE "public"."Grades"`);
        await queryRunner.query(`DROP TABLE "Student"`);
        await queryRunner.query(`DROP TABLE "Offering"`);
        await queryRunner.query(`DROP TABLE "Semester"`);
        await queryRunner.query(`DROP TYPE "public"."SemesterId"`);
        await queryRunner.query(`DROP TABLE "CoreUnits"`);
        await queryRunner.query(`DROP TABLE "Unit"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0332672b01311a9ad54856b2b"`);
        await queryRunner.query(`DROP TABLE "Course"`);
        await queryRunner.query(`DROP TABLE "Faculty"`);
        await queryRunner.query(`DROP TABLE "Campus"`);
    }

}
