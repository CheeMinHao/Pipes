import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingController } from 'src/controllers/scraping.controller';
import { ScrapingService } from 'src/services/scraping.service';
import { Offering } from 'src/entities/offering.entity';
import { Unit } from 'src/entities/unit.entity';
import { CsvModule } from 'nest-csv-parser';

@Module({
  imports: [TypeOrmModule.forFeature([Offering, Unit]), CsvModule],
  providers: [ScrapingService],
  controllers: [ScrapingController],
})
export class ApiModule {}
