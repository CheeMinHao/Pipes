import { Injectable, BadRequestException } from '@nestjs/common';

// const Parallel = require('paralleljs');
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
