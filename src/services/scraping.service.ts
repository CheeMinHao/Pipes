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

  //   {
  //     "name": "Positive psychology",
  //     "overview": "Positive psychology focuses on promoting optimal human functioning. Theoretical perspectives will be examined to demonstrate the impact of positive conditions in achieving desirable outcomes. Information concerning the latest evidence-based interventions about what makes people happy and how happiness is defined and measured will be presented. The relevance of positive psychology in a range of contexts and across the life span will be explored. Numerous and varied learning approaches such as debates, case studies, role plays, watching videos, keeping journals and research activities will be undertaken. This unit will be based on evidence-based knowledge and practice and will also involve an experiential component to facilitate learning.",
  //     "unit_code": "PSY3250",
  //     "faculty_name": "Faculty of Medicine, Nursing and Health Sciences",
  //     "categories": [
  //         "End of semester individual written project (2,000 - 2,500 words)",
  //         "Digital group presentation",
  //         "Written report (2,000 - 2,500 words) / Reflective journal (5 journal entries 8% 400-500 words)"
  //     ],
  //     "credit_point": "6",
  //     "offerings": [
  //         {
  //             "year": 2021,
  //             "semester": "First semester",
  //             "location": "Malaysia",
  //             "attendance_mode": "On-campus"
  //         },

  //             "year": 2020,
  //             "semester": "First semester",
  //             "location": "Malaysia",
  //             "attendance_mode": "On-campus"
  //         }
  //     ]
  // }

  async readUnitsAndOfferings(
    inputFileStream: Express.Multer.File,
  ): Promise<boolean> {
    const jsonUnitOffering = JSON.parse(inputFileStream.buffer.toString());
    const dataArray = jsonUnitOffering['data'];

    //TODO: clean up variable naming
    // const faculty = await this.facultyRepository.find();
    // const facultyMap = faculty.reduce(
    //   (prev, current) => ({
    //     [current.name]: current.id,
    //     ...prev,
    //   }),
    //   {},
    // );
    // const cleanedArray = dataArray.map((obj) => {
    //   return {
    //     faculty: facultyMap[obj.faculty_name.toLowerCase()],
    //     creditPoints: parseInt(obj.credit_point),
    //     unitCode: obj.unit_code,
    //     overview: obj.overview,
    //     name: obj.name,
    //   };
    // });

    // console.log(cleanedArray);

    // const result = await this.unitRepository.save(cleanedArray);

    // return result;

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

  async readStudents(inputFileStream: Express.Multer.File): Promise<boolean> {
    const jsonStudent = JSON.parse(inputFileStream.buffer.toString());
    console.log(jsonStudent);
    const dataArray = jsonStudent['data'];

    const course = await this.facultyRepository.find();
    const courseMap = course.reduce(
      (prev, current) => ({
        [current.name]: current.id,
        ...prev,
      }),
      {},
    );

    const campus = await this.campusRepository.find();
    const campusMap = campus.reduce(
      (prev, current) => ({
        [current.location]: current.id,
        ...prev,
      }),
      {},
    );

    const cleanedArray = dataArray.map((obj) => {
      return {
        surname: obj.surname,
        givenName: obj.given_name,
        intake: obj.intake,
        course: courseMap[obj.course_name.toLowerCase()],
        campus: campusMap[obj.campus_name.toLowerCase()],
      };
    });

    const result = await this.studentRepository.save(cleanedArray);

    return result;
  }

  async uploadStudentCourses(
    inputFileStream: Express.Multer.File,
  ): Promise<any> {
    try {
      const readableInstanceStream = bufferToStream(inputFileStream.buffer);
      const entities: {
        list: CsvInput[];
      } = await new CsvParser().parse(readableInstanceStream, CsvInput);
      const key = Object.keys(entities.list[0])[0];
      const processList = async (data) => {
        return data[key].split(',');
      };
      const listEntities: CsvInput[] = entities.list;
      listEntities.map(processList);
      // console.log(
      //   'Parallel JS ----------------------------------------------------------------',
      // );
      // console.time('test2');
      // var p = new Parallel(listEntities);
      // await p.map(test);
      // console.timeEnd('test2');
      // console.log(
      //   'For Loop ----------------------------------------------------------------',
      // );
      // console.time('test4');
      // for (let i = 0, l = listEntities.length; i < l; i++) {
      //   const hehe = test(listEntities[i]);
      // }
      // console.timeEnd('test4');
      return entities?.list;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
