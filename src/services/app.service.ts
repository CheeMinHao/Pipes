import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
