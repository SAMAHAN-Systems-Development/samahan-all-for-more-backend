import { Module } from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { BulletinController } from './bulletin.controller';

@Module({
  controllers: [BulletinController],
  providers: [BulletinService],
})
export class BulletinModule {}
