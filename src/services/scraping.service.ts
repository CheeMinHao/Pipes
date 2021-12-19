import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Offering } from '../entities/offering.entity';
import CsvInput from '../dto/csvInput.dto';
import UnitsAndOfferings from '../dto/unitsAndOfferings';
import { Unit } from 'src/entities/unit.entity';

import { bufferToStream } from 'src/helpers/helpers';
import { CsvParser } from 'nest-csv-parser';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(Offering)
    private readonly offeringRepository: Repository<Offering>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
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
    jsonUnitOffering['data'].forEach(
      ({
        name,
        overview,
        unit_code,
        faculty_name,
        categories,
        credit_point,
        offerings,
      }: UnitsAndOfferings) => {
        this.offeringRepository.create();

        console.log({
          name,
          overview,
          unit_code,
          faculty_name,
          categories,
          credit_point,
          offerings,
        });
      },
    );
    return true;
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
