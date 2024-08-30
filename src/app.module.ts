import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { BulletinModule } from './bulletin/bulletin.module';

@Module({
  imports: [PrismaModule, SupabaseModule, AuthModule, BulletinModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
