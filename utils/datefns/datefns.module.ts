import { Module } from '@nestjs/common';
import { DateFNSService } from './datefns.service';

@Module({
  providers: [DateFNSService],
  exports: [DateFNSService],
})
export class DateFNSModule {}
