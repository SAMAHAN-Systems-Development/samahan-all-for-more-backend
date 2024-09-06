import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { BulletinModule } from './bulletin/bulletin.module';
import { CategoryModule } from './category/category.module';
import { UtilModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    BulletinModule,
    CategoryModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
