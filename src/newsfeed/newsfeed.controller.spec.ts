import { Test, TestingModule } from '@nestjs/testing';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';

describe('NewsfeedController', () => {
  let controller: NewsfeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsfeedController],
      providers: [NewsfeedService, PrismaService, SupabaseService, JwtService],
    }).compile();

    controller = module.get<NewsfeedController>(NewsfeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
