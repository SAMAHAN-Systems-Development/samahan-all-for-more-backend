import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedService } from './newsfeed.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NewsfeedService', () => {
  let service: NewsfeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsfeedService,
        PrismaService,
        SupabaseService,
        PrismaService,
      ],
    }).compile();

    service = module.get<NewsfeedService>(NewsfeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
