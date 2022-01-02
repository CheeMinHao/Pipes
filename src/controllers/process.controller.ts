import { Controller, Get, Post } from '@nestjs/common';
import { CourseEngineService } from '../services/course_engine.service';

@Controller('/api/v1/process')
export class ProcessController {
  constructor(private readonly ceService: CourseEngineService) {}

  @Post()
  async processCourses(): Promise<any> {
    const takenCourses = [
      { code: 'FIT3199', tag: 3, creditPoints: 6 },
      { code: 'FIT2014', tag: 2, creditPoints: 6 },
      { code: 'FIT1045', tag: 1, creditPoints: 6 },
    ];
    const config = { isInternational: false, courseCode: 'C2001' };
    return await this.ceService.processStudent(config, takenCourses);
  }
}
