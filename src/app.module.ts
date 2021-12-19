import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { dbConfig } from './config/config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig as PostgresConnectionOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
