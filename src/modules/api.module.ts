import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingController } from 'src/controllers/scraping.controller';
import { ScrapingService } from 'src/services/scraping.service';
import { Offering } from 'src/entities/offering.entity';
import { Unit } from 'src/entities/unit.entity';
import { CsvModule } from 'nest-csv-parser';
import { Faculty } from 'src/entities/faculty.entity';
import { Student } from 'src/entities/student.entity';
import { Campus } from 'src/entities/campus.entity';
import { Course } from 'src/entities/course.entity';
import { Semester } from 'src/entities/semester.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offering,
      Unit,
      Faculty,
      Student,
      Campus,
      Course,
      Semester,
    ]),
    CsvModule,
  ],
  providers: [ScrapingService],
  controllers: [ScrapingController],
})
export class ApiModule {}
