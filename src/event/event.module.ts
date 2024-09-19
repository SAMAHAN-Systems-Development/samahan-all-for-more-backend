import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
