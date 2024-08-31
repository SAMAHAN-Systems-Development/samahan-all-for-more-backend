import { Module } from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { BulletinController } from './bulletin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [BulletinController],
  providers: [BulletinService],
})
export class BulletinModule {}
