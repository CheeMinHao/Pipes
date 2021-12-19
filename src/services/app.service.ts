import { Injectable, BadRequestException } from '@nestjs/common';

// const Parallel = require('paralleljs');
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
// test: 0.160ms
// test: 0.061ms
// test: 0.085ms
// test: 0.067ms
// test: 0.090ms
