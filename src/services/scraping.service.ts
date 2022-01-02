import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Offering } from '../entities/offering.entity';
import CsvInput from '../dto/csvInput.dto';
import UnitsAndOfferings from '../dto/unitsAndOfferings';
import { Unit } from 'src/entities/unit.entity';
import Students from '../dto/students';
import { Faculty } from 'src/entities/faculty.entity';
import { Student } from 'src/entities/student.entity';
import { Campus } from 'src/entities/campus.entity';
import { Course } from 'src/entities/course.entity';
import { Semester } from 'src/entities/semester.entity';

import { bufferToStream } from 'src/helpers/helpers';
import { CsvParser } from 'nest-csv-parser';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(Offering)
    private readonly offeringRepository: Repository<Offering>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async uploadStudentCourses(
    inputFileStream: Express.Multer.File,
  ): Promise<any> {
    try {
      const readableInstanceStream = bufferToStream(inputFileStream.buffer);
      const entities: {
        list: CsvInput[];
      } = await new CsvParser().parse(readableInstanceStream, CsvInput);
      this.validateCourseStatus(this._sanitizeStudentCourseList(entities));
      return this._sanitizeStudentCourseList(entities);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  _sanitizeStudentCourseList(entities: any) {
    const key = Object.keys(entities.list[0])[0];
    const keys = key.split(',');

    return entities.list.map((obj: any) =>
      keys.reduce(
        (prev, curr, index) => ({
          [curr]: obj[key].split(',')[index],
          ...prev,
        }),
        {},
      ),
    );
  }

  async readStudents(inputFileStream: Express.Multer.File): Promise<boolean> {
    const jsonStudent = JSON.parse(inputFileStream.buffer.toString());
    console.log(jsonStudent);
    const dataArray = jsonStudent['data'];

    const campuses = await this.campusRepository.find();

    const clean = dataArray
      .map((obj: any) => {
        const students = obj.students;

        return students.map(
          ({ surname, givenName, intake, course, location }) => {
            return {
              surname: surname,
              givenName: givenName,
              intake: intake,
              course: course,
              campus: campuses.filter(
                ({ location: lc }) =>
                  lc.toLowerCase() === location.toLowerCase(),
              )[0],
            };
          },
        );
      })
      .flatMap((a) => a);

    return clean.length;
  }

  async readUnitsAndOfferings(
    inputFileStream: Express.Multer.File,
  ): Promise<boolean> {
    const jsonUnitOffering = JSON.parse(inputFileStream.buffer.toString());
    const dataArray = jsonUnitOffering['data'];

    const semesters = await this.semesterRepository.find();
    const semesterArray = semesters.map(({ code }) => code);
    const campuses = await this.campusRepository.find();

    const unit = await this.unitRepository.find();
    const unitMap = unit.reduce(
      (prev, current) => ({
        [current.unitCode.toLowerCase()]: current.id,
        ...prev,
      }),
      {},
    );

    const clean = dataArray
      .map((obj: any) => {
        const off = obj.offerings;

        return off.map(({ year, name, location }) => {
          const index = semesterArray.findIndex((semester) =>
            name.includes(semester),
          );
          return {
            year: year,
            unit: unitMap[obj.unit_code.toLowerCase()],
            semester: semesters[index].id,
            campus: campuses.filter(
              ({ location: lc }) => lc.toLowerCase() === location.toLowerCase(),
            )[0],
          };
        });
      })
      .flatMap((a) => a);

    return clean.length;
  }

  //Group csv file data by Person Id ('Student ID')
  async validateCourseStatus(csvQueries: Array<any>[]) {
    //build in group function
    const groupBy = function (xs: any, key) {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    const groupedByPersonID = groupBy(csvQueries, 'Person ID');
    //console.log(groupedByPersonID);
    for (var studentID in groupedByPersonID) {
      //Get the student id
      console.log(studentID);
      //Get the course info
      const courseCode = groupedByPersonID[studentID][0]['COURSE_CD'];
      console.log(courseCode);
      console.log(groupedByPersonID[studentID][0]['CRS_TITLE']);
      console.log(groupedByPersonID[studentID]);

      for (var enrolledUnitObj of groupedByPersonID[studentID]) {
        // console.log(enrolledUnitObj);
      }
    }
  }
}
