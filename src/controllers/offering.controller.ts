import { Controller, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ScrapingService } from '../services/scraping.service';

@Controller('/api/v1/offering')
export class OfferingController {
  constructor(private scrapingService: ScrapingService) {}
}
