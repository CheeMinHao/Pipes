import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import CsvInput from 'src/dto/csvInput.dto';
import { ScrapingService } from '../services/scraping.service';

@Controller('/api/v1/scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('uploadStudentCourses')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CsvInput[]> {
    const input = await this.scrapingService.uploadStudentCourses(file);
    return input;
  }

  @Post('uploadUnitAndOffering')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUnitAndOffering(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.scrapingService.readUnitsAndOfferings(file);
  }
}
