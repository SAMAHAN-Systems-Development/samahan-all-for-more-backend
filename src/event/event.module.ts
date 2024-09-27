import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [EventController],
  providers: [EventService, PrismaService, SupabaseService],
})
export class EventModule {}
