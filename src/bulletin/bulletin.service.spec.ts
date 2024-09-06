import { Test, TestingModule } from '@nestjs/testing';
import { BulletinService } from './bulletin.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { DateFNSService } from '../utils/datefns.service';
import { UtilityService } from '../utils/utils.service';

describe('BulletinService', () => {
  let service: BulletinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BulletinService,
        PrismaService,
        SupabaseService,
        DateFNSService,
        UtilityService,
      ],
    }).compile();

    service = module.get<BulletinService>(BulletinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
