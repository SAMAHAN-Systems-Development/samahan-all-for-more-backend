import { Module } from '@nestjs/common';
import { UtilityService } from './utils.service';
import { DateFNSService } from './datefns.service';

@Module({
  providers: [DateFNSService, UtilityService],
  exports: [DateFNSService, UtilityService],
})
export class UtilModule {}
