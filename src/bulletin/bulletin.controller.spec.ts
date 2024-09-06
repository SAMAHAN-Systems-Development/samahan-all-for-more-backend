import { Test, TestingModule } from '@nestjs/testing';
import { BulletinController } from './bulletin.controller';
import { BulletinService } from './bulletin.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { DateFNSService } from '../utils/datefns.service';
import { UtilityService } from '../utils/utils.service';

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
        DateFNSService,
        UtilityService,
      ],
    }).compile();

    controller = module.get<BulletinController>(BulletinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
