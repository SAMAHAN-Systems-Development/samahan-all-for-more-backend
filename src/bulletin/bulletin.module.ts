import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';

import { BulletinService } from './bulletin.service';
import { BulletinController } from './bulletin.controller';
import { IsCategoryIdExistsConstraint } from './bulletin.custom.decorator';
import { ValidateNotSoftDeletePipe } from './bulleting.custom.pipe';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [BulletinController],
  providers: [
    BulletinService,
    IsCategoryIdExistsConstraint,
    ValidateNotSoftDeletePipe,
  ],
})
export class BulletinModule {}
