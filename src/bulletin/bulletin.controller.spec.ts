import { Test, TestingModule } from '@nestjs/testing';
import { BulletinController } from './bulletin.controller';
import { BulletinService } from './bulletin.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { DateFNSModule } from 'utils/datefns/datefns.module';

describe('BulletinController', () => {
  let controller: BulletinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulletinController],
      providers: [
        BulletinService,
        PrismaService,
        SupabaseService,
        AuthGuard,
        JwtService,
        DateFNSModule,
      ],
    }).compile();

    controller = module.get<BulletinController>(BulletinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
